breezePagedGrid
===============

A paging control that plays nice with BreezeJS, KnockoutJS and DurandalJS (think [SPA Template](http://www.johnpapa.net/spa)).

Implementation
==============

Implementation of the breezePagedGrid is fairly simple if using Durandal.  Under the App folder, you will want to place breezePager.js under the viewmodels folder, breezePagedGrid.html in the views folder, the breezePagedGrid.css where you keep your stylesheets,  and the contents of the Contents folder (heh) in the folder that has your images.

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
