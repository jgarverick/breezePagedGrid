/******************************************************************************
*   breezePagerGrid and breezePager objects
*   Implementation listed below is for use with KnockoutJS framework.
*
*
*   Date:   03/27/2013
*   Author: Josh Garverick
*
*	Revisions:
* 	05-03-2013	JMG		Refactored the breezePagedGrid viewmodel to allow for 
*						easier non-DurandalJS use.  Augmented the constructor to
*						accept a contextUrl (for the Breeze controller being used)
*						and the entitySet, or name of the method on the controller
*						to be called.
*						Also added the SetManager and SetQuery methods, which create new
*						EntityManager or EntityQuery objects, depending on what you need.
*
*	05-07-2013	JMG		Added initialization options and moved the DataPromise code from
*						the Durandal widget's controller to the actual object.  That was lame.
*						You can now pass in the context's URL, the actual Breeze entity manager,
*						the name of the entity set to query or the query itself.
*						Also added global search functionality (can turn on/off) along with the option
*						to set up specific columns for querying.  If you don't set up at least one,
*						it won't filter the results for you.
******************************************************************************/
function breezePagedGrid(options) {
    var self = this;
    self.ContextUrl = ko.observable('api/1.0/context');
    self.Query = null;
    self.Manager = null;
    self.Predicate = null;
    self.EntitySet = ko.observable('');
    self.Pager = ko.observable(new breezePager());
    self.Results = ko.observableArray([]);
    self.Columns = ko.observableArray([]);
    self.SearchText = ko.observable('');
    self.ShowSearchBox = ko.observable(false);

    self.Pager().refreshData = function () {
        self.GetData();
    };

    //#region Event Handling
    self.Success = function (data) {
        self.Results([]);
        self.Results(data.results);
        self.Pager().recordCount(data.inlineCount);
    };
    self.Fail = function (err) {
        alert(err);
    };
    //#endregion

    //#region Query Manipulation
    self.SetPredicate = function (predicate) {
        self.Predicate = null;
        self.Pager().pageNumber(1);
        if (predicate) {
            self.Predicate = predicate;
        } else {
            // this is for a global search, meaning that each column in your
            // list of columns will be tagged in this predicate.  If the search text is blank, return.
            if (self.SearchText().length < 1) {
                return;
            }
            $(self.Columns()).each(function (idx, item) {
                if (item.Searchable()) {
                    var predicatePart = new breeze.Predicate(item.FieldName(), breeze.FilterQueryOp.Contains, self.SearchText());
                    self.Predicate = (self.Predicate == null) ? predicatePart : self.Predicate.or(predicatePart);
                }
            });
        }
    }

    //#endregion

    //#region Data Handling
    self.DataPromise = function () {
        var mgr = null;
        // Figure out if the manager was passed in, or if the controller name is passed.  If neither, alert.
        if (self.Manager) {
            mgr = self.Manager;
        } else if (self.ContextUrl() && self.ContextUrl.length > 0) {
            self.Manager = new breeze.EntityManager(self.ContextUrl());
        } else {
            alert("You must pass in either the path to the API controller OR the EntityManager object.");
            return;
        }
        // Figure out if the query was passed in, or if the entity set's name is passed.  If neither, alert.
        var query = null;
        if (self.Query) {
            query = self.Query;
        } else if (self.EntitySet() && self.EntitySet.length > 0) {
            self.Query = query = new breeze.EntityQuery().from(self.EntitySet());
        } else {
            alert("You must pass in either the name of the EntitySet to query OR the EntityQuery object.");
            return;
        }
        // Finalize
        if (self.Predicate) {
            query = self.Query.where(self.Predicate);
        }

        return mgr.executeQuery(query.inlineCount(true).skip(self.Pager().skipItems()).take(parseInt(self.Pager().itemsPerPage())));
    };

    self.GetData = function () {
        self.DataPromise().then(self.Success).fail(self.Fail);
    };

    self.AddColumn = function (colOptions) {
        self.Columns.push(new breezeGridColumn(colOptions.header, colOptions.field, colOptions.control, colOptions.key, colOptions.link, colOptions.canSearch));
    };
    //#endregion

    self.Init = function () {
        if (self.Columns().length > 0) {
            self.Columns([]);
        }
        self.Pager().pageNumber(1);
    };
    // Initialize the options

    if (options) {
        self.ContextUrl(options.contextUrl || 'api/1.0/context');
        self.Manager = options.manager || new breeze.EntityManager(self.ContextUrl());
        if (options.entitySet) {
            self.Query = new breeze.EntityQuery().from(options.entitySet);
        } else if (options.query) {
            self.Query = options.query;
        }

        if (options.predicate) {
            self.Predicate = options.predicate;
        }
        if (options.showSearch) {
            self.ShowSearchBox(options.showSearch);
        }

    }
    // Set up subscription on search text
    self.SearchText.subscribe(function (newValue) {
        self.SetPredicate();
    });

}
/******************************************************************************
*   Model for the pager object
******************************************************************************/
function breezePager() {
    var self = this;
    self.recordCount = ko.observable(0);
    self.itemsPerPage = ko.observable('25');
    self.pageNumber = ko.observable(1);
    self.refreshData = function () {
    };
    self.maxPages = ko.computed(function () {
        return parseInt(self.recordCount() / parseInt(self.itemsPerPage())) + 1;
    });
    self.skipItems = ko.computed(function () {
        return (parseInt(self.pageNumber()) - 1) * parseInt(self.itemsPerPage());
    });

    //#region Paging Operations
    self.nextPage = function () {
        if (self.pageNumber() < self.maxPages()) {
            self.pageNumber(self.pageNumber() + 1);
        }
    };
    self.previousPage = function () {
        if (self.pageNumber() > 1) {
            self.pageNumber(self.pageNumber() - 1);
        }
    };
    self.firstPage = function () {
        self.pageNumber(1);
    };
    self.lastPage = function () {
        self.pageNumber(self.maxPages());
    };
    //#endregion

    //#region Observable Subscriptions
    self.pageNumber.subscribe(function (newValue) {
        self.refreshData();
    });
    self.itemsPerPage.subscribe(function (newValue) {
        self.refreshData();
        if (self.pageNumber() > self.maxPages()) {
            self.pageNumber(1);
        }
    });
    //#endregion
};
/******************************************************************************
*   Model for the grid column(s)
******************************************************************************/
function breezeGridColumn(header, field, controlType, keyField, navLink, searchable) {
    var self = this;
    self.ColumnHeader = ko.observable('');
    self.FieldName = ko.observable('');
    self.DisplayControlType = ko.observable('cell');
    self.KeyField = ko.observable('');
    self.NavLink = ko.observable('');
    self.Searchable = ko.observable(false);
    if (header) {
        self.ColumnHeader(header);
    }
    if (field) {
        self.FieldName(field);
    }
    if (controlType) {
        self.DisplayControlType(controlType);
    }
    if (keyField) {
        self.KeyField(keyField);
    }
    if (navLink) {
        self.NavLink(navLink);
    }
    if (searchable) {
        self.Searchable(searchable);
    }
}
