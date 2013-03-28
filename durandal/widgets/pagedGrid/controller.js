define(function (require) {
    var widget = require('durandal/widget');
    var pagedGrid = require('durandal/lib/breezePager');

    var ctor = function (element, settings) {
        this.settings = settings;
        settings.grid = settings.grid || new breezePagedGrid();
        settings.grid.Init();
        $(settings.dataOptions.columns).each(function (idx, item) {
            settings.grid.AddColumn(item.header, item.field, item.control, item.key, item.link);
        });

        settings.grid.DataPromise = function () {
            var mgr = null;
            // Figure out if the manager was passed in, or if the controller name is passed.  If neither, alert.
            if (settings.dataOptions.manager) {
                mgr = settings.dataOptions.manager;
            } else if (settings.dataOptions.controller && settings.dataOptions.controller.length > 0) {
                mgr = new breeze.EntityManager(settings.dataOptions.controller);
            } else {
                alert("You must pass in either the path to the API controller OR the EntityManager object.");
                return;
            }
            // Figure out if the query was passed in, or if the entity set's name is passed.  If neither, alert.
            var query = null;
            if (settings.dataOptions.query) {
                query = settings.dataOptions.query.inlineCount(true);
            } else if (settings.dataOptions.entitySet && settings.dataOptions.entitySet.length > 0) {
                query = new breeze.EntityQuery().from(settings.dataOptions.entitySet);
            } else {
                alert("You must pass in either the name of the EntitySet to query OR the EntityQuery object.");
                return;
            }
            // Finalize
            query = query.skip(settings.grid.Pager().skipItems()).take(parseInt(settings.grid.Pager().itemsPerPage()));
            return mgr.executeQuery(query);
        };

        settings.grid.GetData();
    };

    return ctor;


});