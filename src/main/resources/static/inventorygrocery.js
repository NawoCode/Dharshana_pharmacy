

 

        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {

            //tooltip enable
            $('[data-toggle="tooltip"]').tooltip()

            // add / clear / update buttons Event Handler
            // btnAdd.addEventListener("click",btnAddMC);
            // btnClear.addEventListener("click",btnClearMC);
            // btnUpdate.addEventListener("click",btnUpdateMC);
            //
            // cmbUnit.addEventListener("change",cmbUnitCH);
            // cmbItemType.addEventListener("change",cmbItemTypeCH);
            //cmbCategory.addEventListener("change",cmbItemTypeCH);

            txtSearchName.addEventListener("keyup",btnSearchMC);

            privilages = httpRequest("../privilage?module=INVENTORY","GET");

            iteminventorystastus = [{"id":1,"name":"Available"},{"id":2,"name":"Not-Available"},{"id":3,"name":"Low-Inventory"}];

            valid = "2px solid green";
            invalid = "2px solid red";
            initial = "2px solid #d6d6c2";
            updated = "2px solid #ff9900";
            active = "#ff9900";

            loadView();
            loadForm();


            //changeTab('table');
        }

        function loadView() {

            //Search Area
            txtSearchName.value="";
            txtSearchName.style.background = "";

            //Table Area
            activerowno = "";
            activepage = 1;
            var query = "&searchtext=";
            loadTable(1,cmbPageSize.value,query);
        }

        // for fill data into table
        function loadTable(page,size,query) {
            page = page - 1;
            items = new Array();
          var data = httpRequest("/iteminventory/list?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) items = data.content;
            for (var index in items){
                if (items[index].item_id.rop != null){
                    if (items[index].avaqty > items[index].item_id.rop){
                        items[index].itemstatus_id = iteminventorystastus[0];
                    }else if (items[index].avaqty <= items[index].item_id.rop){
                        items[index].itemstatus_id = iteminventorystastus[2];
                    }
                }
                if (items[index].avaqty == 0){
                    items[index].itemstatus_id = iteminventorystastus[1];
                }
            }
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblItem',items,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblItem);

            if(activerowno!="")selectRow(tblItem,activerowno,active);

        }

        function paginate(page) {
            var paginate;
            if(olditem==null){
                paginate=true;
            }else{
                if(getErrors()==''&&getUpdates()==''){
                    paginate=true;
                }else{
                    paginate = window.confirm("Form has Some Errors or Update Values. " +
                        "Are you sure to discard that changes ?");
                }
            }
            if(paginate) {
                activepage=page;
                activerowno=""
                loadForm();
                loadSearchedTable();
            }

        }

        function viewitem(itm,rowno) {

            itmveiw = JSON.parse(JSON.stringify(itm));

            tdicode.innerHTML = itmveiw.item_id.itemcode;
            tdiname.innerHTML = itmveiw.item_id.itemname;
            tdrop.innerHTML = itmveiw.item_id.rop;
            tdavaqty.innerHTML = itmveiw.avaqty;
            tdtotqty.innerHTML = itmveiw.returnqty;
            tdreurnqty.innerHTML = itmveiw.totalqty;
            tdistatus.innerHTML = itmveiw.itemstatus_id.name;

            $('#dataVeiwModal').modal('show')


         }

         function btnPrintRowMC(){

             var format = printformtable.outerHTML;

             var newwindow=window.open();
             newwindow.document.write("<html>" +
                 "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style>" +
                 "<link rel=\'stylesheet\' href=\'resources/bootstrap/css/bootstrap.min.css\'></head>" +
                 "<body><div style='margin-top: 150px'><h1 style='text-align: center'>Dharshana Pharmacy & Grocery</h1><h2>Item Details :</h2></div>" +
                 "<div>"+format+"</div>" +
                 "<script>printformtable.removeAttribute('style')</script>" +
                 "</body></html>");
             setTimeout(function () {newwindow.print(); newwindow.close();},100);
         }


        function loadForm() {
           item = new Object();
            olditem = null;

             disableButtons(false, true, true);

        }

        function setStyle(style) {

            txtItemCode.style.border = style;
            cmbItemType.style.border = style;
            cmbBrand.style.border = style;
            cmbSubcategory.style.border = style;
            cmbCategory.style.border = style;
            cmbUnit.style.border = style;
            // cmbUnitType.style.border = style;
            cmbGeneric.style.border = style;
            cmbProductType.style.border = style;
            txtItemName.style.border = style;
            txtRop.style.border = style;
            txtRoq.style.border = style;
            txtItmDescription.style.border = style;
            dteAsignDate.style.border = style;
            cmbAssignBy.style.border = style;
            cmbStatus.style.border = style;


        }

        function disableButtons(add, upd, del) {

            // select deleted data row
            for(index in items){

                tblItem.children[1].children[index].lastChild.children[0].style.display = "none";
                tblItem.children[1].children[index].lastChild.children[1].style.display = "none";

                if(items[index].itemstatus_id.name =="Available"){
                    tblItem.children[1].children[index].style.backgroundColor = "#72f36e";
                    tblItem.children[1].children[index].style.border = "2px solid green";

                }
                if(items[index].itemstatus_id.name =="Not-Available"){
                    tblItem.children[1].children[index].style.backgroundColor = "#ee8b44";
                    tblItem.children[1].children[index].style.border = "2px solid orange";

                }
                if(items[index].itemstatus_id.name =="Low-Inventory"){
                    tblItem.children[1].children[index].style.backgroundColor = "#ee5d5d";
                    tblItem.children[1].children[index].style.border = "2px solid red";

                }
            }

        }


        function getErrors() {

            var errors = "";
            addvalue = "";

            if (item.itemtype_id == null) {
                cmbItemType.style.border = invalid;
                errors = errors + "\n" + "Item Type Not Selected";
            }
            else  addvalue = 1;

            if (item.brand_id == null) {
                cmbBrand.style.border = invalid;
                errors = errors + "\n" + "Brand Not Selected";
            }
            else  addvalue = 1;

            if (cmbCategory.value == "") {
                cmbCategory.style.border = invalid;
                errors = errors + "\n" + "Category Not Selected";
            }
            else  addvalue = 1;

            if (item.subcategory_id == null) {
                cmbSubcategory.style.border = invalid;
                errors = errors + "\n" + "Subcategory Not Selected";
            }
            else  addvalue = 1;

            if (item.unit_id == null) {
                cmbUnit.style.border = invalid;
                errors = errors + "\n" + "Unit Not Selected";
            }
            else  addvalue = 1;

            if (item.generic_id == null) {
                cmbGeneric.style.border = invalid;
                errors = errors + "\n" + "Generic Name Not Selected";
            }
            else  addvalue = 1;

            if (item.producttype_id == null) {
                cmbProductType.style.border = invalid;
                errors = errors + "\n" + "Product Type Not Selected";
            }
            else  addvalue = 1;

            if (item.itemname == null) {
                txtItemName.style.border = invalid;
                errors = errors + "\n" + "Item Name Not Enter";
            }
            else  addvalue = 1;

            return errors;

        }

        function btnAddMC(){
            if(getErrors()==""){
                if(txtRop.value=="" || txtRoq.value=="" || txtItmDescription.value ==""){
                    swal({
                        title: "Are you sure to continue...?",
                        text: "Form has some empty fields.....",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    }).then((willDelete) => {
                        if (willDelete) {
                            savedata();
                        }
                    });

                }else{
                    savedata();
                }
            }else{
                swal({
                    title: "You have following errors",
                    text: "\n"+getErrors(),
                    icon: "error",
                    button: true,
                });

            }
        }
        
        function savedata() {

            swal({
                title: "Are you sure to add following Item...?" ,
                  text :  "\nItemcode : " + item.itemcode +
                    "\nItem Type : " + item.itemtype_id.name +
                    "\nBrand : " + item.brand_id.name +
                    "\nCategory : " + item.subcategory_id.category_id.name +
                    "\nSubcategory : " + item.subcategory_id.name +
                    "\nUnit : " + item.unit_id.name + item.unit_id.unittype_id.name +
                    "\nGeneri /name : " + item.generic_id.name +
                    "\nProduct Type : " + item.producttype_id.name +
                    "\nItem Name : " + item.itemname +
                    "\nItem Status : " + item.itemstatus_id.name,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/item", "POST", item);
                    if (response == "0") {
                        swal({
                            position: 'center',
                            icon: 'success',
                            title: 'Your work has been Done \n Save SuccessFully..!',
                            text: '\n',
                            button: false,
                            timer: 1200
                        });
                        activepage = 1;
                        activerowno = 1;
                        loadSearchedTable();
                        loadForm();
                        changeTab('table');
                    }
                    else swal({
                        title: 'Save not Success... , You have following errors', icon: "error",
                        text: '\n ' + response,
                        button: true
                    });
                }
            });

        }

        function btnClearMC() {
            //Get Cofirmation from the User window.confirm();
            checkerr = getErrors();

            if(olditem == null && addvalue == ""){
                loadForm();
            }else{
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        loadForm();
                    }

                });
            }

        }

        function fillForm(itm,rowno){
            activerowno = rowno;

            if (olditem==null) {
                filldata(itm);
            } else {
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        filldata(itm);
                    }

                });
            }

        }

        // Re fill data into form
        function filldata(itm) {
            clearSelection(tblItem);
            selectRow(tblItem,activerowno,active);

            item = JSON.parse(JSON.stringify(itm));
            olditem = JSON.parse(JSON.stringify(itm));

            txtItemCode.value = item.itemcode;
            txtItemCode.disabled="disabled";
            txtItemName.value = item.itemname;
            txtRop.value = item.rop;
            txtRoq.value = item.roq;
            dteAsignDate.value = item.addeddate;
            txtItmDescription.value = item.description;

            if(item.prescriptionrequired==true) {
                chPrescrip.checked = true;
                $('#chPrescrip').bootstrapToggle('on')
            }else {
                chPrescrip.checked = false;
                $('#chPrescrip').bootstrapToggle('off')
            }


            fillCombo(cmbItemType,"Select Item Type", itemtypes,"name",item.itemtype_id.name);
            fillCombo(cmbBrand,"Select Brand",brands,"name",item.brand_id.name);
            fillCombo(cmbSubcategory,"Select Subcategory",subcategories,"name",item.subcategory_id.name);
            fillCombo(cmbCategory,"Select Category", categories,"name",item.subcategory_id.category_id.name);
            fillCombo3(cmbUnit,"Select Unit",units,"name","unittype_id.name",item.unit_id.name);
            // fillCombo(cmbUnitType,"Select Unit types",unittypes,"name","");
            fillCombo(cmbGeneric,"Select Generic Name",generics,"name",item.generic_id.name);
            fillCombo(cmbProductType,"Select Product Type",producttypes,"name",item.producttype_id.name);

            fillCombo(cmbStatus,"",itemstatuses,"name",item.itemstatus_id.name);
            cmbStatus.disabled = false;
            fillCombo(cmbAssignBy,"",employees,"callingname",item.employee_id.callingname);

            // setDefaultFile('flePhoto', item.photo);

            disableButtons(true, false, false);
            setStyle(valid);
            changeTab('form');

            //  optional feild
            if(item.description == null)
                txtItmDescription.style.border = initial;

            if(item.rop == null)
                txtRop.style.border = initial;

            if(item.roq == null)
                txtRoq.style.border = initial;

        }

        function getUpdates() {

            var updates = "";

            if(item!=null && olditem!=null) {

                if (item.itemcode != olditem.itemcode)
                    updates = updates + "\nItem Code is Changed " + olditem.itemcode + " into " + item.itemcode;

                if (item.itemname != olditem.itemname)
                    updates = updates + "\nItem Name is Changed " + olditem.itemname + " into " + item.itemname;

                if (item.itemtype_id.name != olditem.itemtype_id.name)
                    updates = updates + "\nItem Type is Changed " + olditem.itemtype_id.name + " into " + item.itemtype_id.name;

                if (item.brand_id.name != olditem.brand_id.name)
                    updates = updates + "\nBrand Name is Changed " + olditem.brand_id.name + " into " + item.brand_id.name;

                if (item.subcategory_id.name != olditem.subcategory_id.name)
                    updates = updates + "\nSubcategory is Changed " + olditem.subcategory_id.name + " into " + item.subcategory_id.name;

                if (JSON.parse(cmbCategory.value).name != olditem.subcategory_id.category_id.name)
                    updates = updates + "\nCategory is Changed " + olditem.subcategory_id.category_id.name + " into " + JSON.parse(cmbCategory.value).name;

                if (item.unit_id.name != olditem.unit_id.name)
                    updates = updates + "\nUnit is Changed " + olditem.unit_id.name + " into " + item.unit_id.name;

                if (item.generic_id.name != olditem.generic_id.name)
                    updates = updates + "\nGeneric Name is Changed " + olditem.generic_id.name + " into " + item.generic_id.name;

                if (item.producttype_id.name != olditem.producttype_id.name)
                    updates = updates + "\nProduct Type is Changed " + olditem.subcategory_id.name + " into " + item.subcategory_id.name;

                if (item.prescriptionrequired != olditem.prescriptionrequired)
                    updates = updates + "\nPrescription Required is Changed ";

                if (item.rop != olditem.rop)
                    updates = updates + "\nROP is Changed " + olditem.rop + " into " + item.rop;

                if (item.roq != olditem.roq)
                    updates = updates + "\nROQ is Changed " + olditem.roq + " into " + item.roq;

                if (item.addeddate != olditem.addeddate)
                    updates = updates + "\nAddedd Date is Changed " + olditem.addeddate + " into " + item.addeddate;


                if (item.description != olditem.description)
                    updates = updates + "\nDescription is Changed " + olditem.description + " into " + item.description;

                if (item.itemstatus_id.name != olditem.itemstatus_id.name)
                    updates = updates + "\nItemstatus is Changed " + olditem.itemstatus_id.name + " into " + item.itemstatus_id.name;
            }

            return updates;

        }

        // update function
        function btnUpdateMC() {
            var errors = getErrors();
            if (errors == "") {
                var updates = getUpdates();
                if (updates == "")
                    swal({
                    title: 'Nothing Updated..!',icon: "warning",
                    text: '\n',
                    button: false,
                    timer: 1200});
                else {
                    swal({
                        title: "Are you sure to update following Item details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    })
                        .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/item", "PUT", item);
                            if (response == "0") {
                                swal({
                                    position: 'center',
                                    icon: 'success',
                                    title: 'Your work has been Done \n Update SuccessFully..!',
                                    text: '\n',
                                    button: false,
                                    timer: 1200
                                });
                                loadSearchedTable();
                                loadForm();
                                changeTab('table');

                            }
                            else  swal({
                                    title: 'Failed to add..',icon: "error",
                                    text: 'You ave ollowing error \n '+response,
                                    button: true});

                        }
                        });
                }
            }
            else
                swal({
                    title: 'You have following errors in your form',icon: "error",
                    text: '\n '+getErrors(),
                    button: true});

        }

        function btnDeleteMC(itm) {
            item = JSON.parse(JSON.stringify(itm));

            swal({
                title: "Are you sure to delete following item...?",
                text: "\n Itemcode : " + item.itemcode +
                "\n Item Name : " + item.itemname,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/item","DELETE",item);
                    if (responce==0) {
                        swal({
                            title: "Deleted Successfully....!",
                            text: "\n\n  Status change to delete",
                            icon: "success", button: false, timer: 1200,
                        });
                        loadSearchedTable();
                        loadForm();
                    } else {
                        swal({
                            title: "You have following erros....!",
                            text: "\n\n" + responce,
                            icon: "error", button: true,
                        });
                    }
                }
            });

       }

        function loadSearchedTable() {

            var searchtext = txtSearchName.value;

            var query ="&searchtext=";

            if(searchtext!="")
                query = "&searchtext=" + searchtext;
            //window.alert(query);
            //for load table
            loadTable(activepage, cmbPageSize.value, query);
            disableButtons(false, true, true);

        }

        function btnSearchMC(){
            activepage=1;
            loadSearchedTable();
        }

        function btnSearchClearMC(){
               loadView();
        }

       function btnPrintTableMC(item) {

            var newwindow = window.open();
            formattab = tblItem.outerHTML;

           newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
                "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 150px; '><h1 style='text-align: center'>Dharshana Pharmacy & Grocery</h1><h1>Items Details : </h1></div>" +
                "<div>"+ formattab+"</div>"+
               "</body>" +
                "</html>");
           setTimeout(function () {newwindow.print(); newwindow.close();},100) ;
        }

        function sortTable(cind) {
            cindex = cind;

         var cprop = tblItem.firstChild.firstChild.children[cindex].getAttribute('property');

           if(cprop.indexOf('.') == -1) {
               items.sort(
                   function (a, b) {
                       if (a[cprop] < b[cprop]) {
                           return -1;
                       } else if (a[cprop] > b[cprop]) {
                           return 1;
                       } else {
                           return 0;
                       }
                   }
               );
           }else {
               items.sort(
                   function (a, b) {
                       if (a[cprop.substring(0,cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.')+1)] < b[cprop.substring(0,cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.')+1)]) {
                           return -1;
                       } else if (a[cprop.substring(0,cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.')+1)] > b[cprop.substring(0,cprop.indexOf('.'))][cprop.substr(cprop.indexOf('.')+1)]) {
                           return 1;
                       } else {
                           return 0;
                       }
                   }
               );
           }
            fillTable('tblItem',items,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblItem);
            loadForm();

            if(activerowno!="")selectRow(tblItem,activerowno,active);


        }

        function itemNameBinder() {
            //txtItemName,'^.*$','item','itemname','olditem'
            var val = txtItemName.value.trim();
            if (val != ""){
                var regpattern = new RegExp('^.*$');
                if (regpattern.test(val)){
                    var response = httpRequest("/item/byitemname?itemname="+val, "GET");
                    if (response == ""){
                        item.itemname = val;
                        if ( olditem!= null && item.itemname != olditem.itemname){
                            txtItemName.style.border = updated;
                        }else {
                            txtItemName.style.border = valid;
                        }
                    }else {
                        swal({
                            title: "Item Name already exit....!",
                            text: "\n\n" ,
                            icon: "warning", button: false, timer: 1500
                        });
                        txtItemName.style.border = invalid;
                        item.itemname = null;
                    }
                }else {
                    txtItemName.style.border = invalid;
                    item.itemname = null;
                }
            }else{
                if (txtItemName.required){
                    txtItemName.style.border = invalid;

                }else {
                    txtItemName.style.border = initial;
                }
                item.itemname = null;
            }
        }