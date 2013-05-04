breezePagerGrid Installation Notes
==================================

These installation notes apply to using this control outside the confines of the DurandalJS framework, as well as implementing the DurandalJS widget.

   
* Implementing the breezePagerGrid in a non-Durandal environment is fairly simple.  You will want to import the breezePager.js file from the "durandal\lib" folder into your scripts folder (or a folder of your choosing), and add an include for it wherever you need it.  You will also need to copy in the breezePagedGrid.html file wherever you are storing shared knockout templates.  Alternatively, you can rename the file to .cshtml if you wish to use it as a Razor view in an MVC app.  An example project can be found in the GitHub repo under the "webapi" folder.

* Implementing the DurandalJS widget is even easier.  Copy the contents of the "durandal" folder and paste those into your existing "durandal" folder. Or you can install the [NuGet package](https://nuget.org/packages/breezePagedGrid.widget/0.9.1).

* In either scenario, you will want to copy the stylesheet located in the "content" folder, along with the "images" folder, to your content folder.
