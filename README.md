breezePagedGrid
===============

A paging control that plays nice with BreezeJS, KnockoutJS and DurandalJS (think [SPA Template](http://www.johnpapa.net/spa)).

License
=======

This software is licensed under the MIT license.

Dependencies
============
At a minimum, this grid requires:
* [jQuery](http://jquery.com)
* [KnockoutJS](http://knockoutjs.com/)
* [BreezeJS](http://www.breezejs.com/)

Also, you can use this with [DurandalJS](http://durandaljs.com/) but that's not a requirement desipte the lengthy directions about installing for Durandal shown below.

Implementation
==============

Implementation of the breezePagedGrid is fairly simple if using Durandal.  Under the App folder, you will want to place breezePager.js under the viewmodels folder, breezePagedGrid.html in the views folder, the breezePagedGrid.css where you keep your stylesheets,  and the contents of the Contents folder (heh) in the folder that has your images.
Or, you can also check out the [Installation Notes](breezePager.install.md) for other options.

Then, in any view that you wish to use the control in, simply add the following line of code:

`<!-- ko compose {view: 'breezePagedGrid'} --> <!-- /ko -->`

As for the data hookups, you will want to add an object to your viewmodel called 'breezePagedGrid' and initialize it as a new breezePagedGrid object.
  ```javascript
      var vm = {
        activate: activate,
        title: 'My Groups',
        breezePagedGrid: new breezePagedGrid()

    };
  ```
Then, call the `Init()` function to clear out any lingering column definitions and set the page number to 1:
  ```javascript
  vm.breezePagedGrid.Init();
  ```
Next you can set up any column definitions you might need:
  ```javascript
  vm.breezePagedGrid.AddColumn("Header Text", "Field Name", "Control Template Name");
  ```
Now it's time to set up the promise.  The notion is that you are using BreezeJS for entity management, and you are constructing a query to be executed by the EntityManager.  Consider the following:
  ```javascript
  var mgr = new breeze.EntityManager("path/to/api");
  var query = new breeze.EntityQuery()
              .from("YourEntities").inlineCount(true)
              .skip(vm.breezePagedGrid.Pager().skipItems())
              .take(parseInt(vm.breezePagedGrid.Pager().itemsPerPage()));
  // Optional predicate
  var p1 = new breeze.Predicate("ThisField","==","val");
  query = query.where(p1);
  // Here's the setup
  vm.breezePagedGrid.DataPromise = function(){
    return mgr.executeQuery(query);
  };
  ```
  
Cap that off with a call to `GetData()` to fire up the dataset:
  ```javascript
  vm.breezePagedGrid.GetData();
  ```

DurandalJS Widget
=================

If you prefer to use the DurandalJS widget, you may copy the durandal folder in the source into your App/durandal folder.
Keep in mind the implementation will be somewhat different.  For starters, the `data-bind` attribute can be used to create the control:
```
  <div data-bind="widget: { kind: 'pagedGrid', dataOptions: dataManager }"></div>
```
Next, instead of using the `breezePagedGrid` property on the viewmodel, you will want to use a `dataManager` object instead.  For example:
```javascript
    var vm = {
        activate: activate,
        title: 'My Groups',
        dataManager: {
            // You can use the names of the entity set and the controller...
            controller: 'path/to/context',
            entitySet: 'MyEntities',
            // ...or you can use the actual objects, too
            manager: new breeze.EntityManager("path/to/context"),
            query: new breeze.EntityQuery().from("MyEntities"),
            // These are the columns to display in the grid
            columns: null
        },
        init: function () {
            if (vm.dataManager.columns == null || (vm.dataManager.columns && vm.dataManager.columns.length > 0)) {
                vm.dataManager.columns = new Array();
            }
        }
    };
```
The manager will be an `EntityManager` instance, the query will be a base `EntityQuery` instance, and columns will simply be initialized as an empty array.  If the `manager` and `query` objects are not passed in, you must at least provide the path of the API controller and the name of the entity set to query, or the control will not function.
For wiring up the columns, call the `init` method to initialize the columns array, and then you can simply pass in generic objects, making sure to use the named properties listed:
```javascript
  vm.dataManager.columns.push({ header: "Colulmn Name", field: "Field Name", control: "id-nav-link", key: "EntityKeyFieldName", link: "#/route" });
```
You will also want to make sure that any predicates that rely on values being passed in (i.e. via the `splat`) are assigned to the query within the `activate` method.
```javascript
  vm.dataManager.query = vm.dataManager.query.where("Id", "==", vm.Id());
```
The controller file in the widget will handle wiring up the `inlineCount` and associations to the skip and take properties on the Pager.  It's important to note that I am using an init function on the viewmodel to help determine whether or not the columns array needs to be cleaned out.  With caching and what-not, I was running into issues with the grid populating the columns multiple times when navigating to a different page, then using the Back button on the browser to nav back to the grid.
