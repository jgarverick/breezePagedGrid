define(function (require) {
    var widget = require('durandal/widget');
    var pagedGrid = require('durandal/lib/breezePager');

    var ctor = function (element, settings) {
        this.settings = settings;
        settings.grid = settings.grid || new breezePagedGrid({ predicate: settings.predicate, manager: settings.dataOptions.manager, contextUrl: settings.dataOptions.controller, entitySet: settings.dataOptions.entitySet, query: settings.dataOptions.query, showSearch: settings.showSearch });
        settings.grid.Init();
        $(settings.dataOptions.columns).each(function (idx, item) {
            settings.grid.AddColumn(item);
        });
        settings.grid.GetData();
    };

    return ctor;


});