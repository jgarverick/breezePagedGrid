define(function (require) {
    var widget = require('durandal/widget');
    var pagedGrid = require('./breezePager');

    var ctor = function (element, settings) {
        this.settings = settings;
        settings.grid = settings.grid || new breezePagedGrid();
        settings.grid.Init();
        $(settings.dataOptions.columns).each(function (idx, item) {
            settings.grid.AddColumn(item.header, item.field, item.display, item.key, item.link);
        });

        settings.grid.DataPromise = function () {
            var query = settings.dataOptions.query.inlineCount(true).skip(settings.grid.Pager().skipItems()).take(parseInt(settings.grid.Pager().itemsPerPage()));
            return settings.dataOptions.manager.executeQuery(query);
        };

        settings.grid.GetData();
    };

    return ctor;


});