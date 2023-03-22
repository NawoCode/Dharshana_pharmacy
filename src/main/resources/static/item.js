

 

        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {

            //tooltip enable
            $('[data-toggle="tooltip"]').tooltip();

            $('.js-example-basic-single').select2();

            // add / clear / update buttons Event Handler
            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);
            btnUpdate.addEventListener("click",btnUpdateMC);

            btnBrandAdd.addEventListener("click",btnBrandAddMc);
            btnBrandCatAdd.addEventListener("click",btnBrandCategoryAddMc);
            btnSubcategoeyAdd.addEventListener("click",btnSubCategoryAddMc);
            btnGenericdAdd.addEventListener("click",btnGenericAddMc);

            //cmbUnit.addEventListener("change",cmbUnitCH);
            cmbItemType.addEventListener("change",cmbItemTypeCH);
            //cmbGeneric.addEventListener("change",cmbGenericCH);

            txtSearchName.addEventListener("keyup",btnSearchMC);

            privilages = httpRequest("../privilage?module=ITEM","GET");
    
            itemtypes = httpRequest("../itemtype/list","GET");
            brands = httpRequest("../brand/list","GET");
            subcategories = httpRequest("../subcategory/list","GET");
            categories = httpRequest("../category/list","GET");
            units = httpRequest("../unit/list","GET");
            // unittypes = httpRequest("../unittype/list","GET");
            generics = httpRequest("../generic/list","GET");
            producttypes = httpRequest("../producttype/list","GET");
            itemstatuses = httpRequest("../itemstatus/list","GET");
            employees = httpRequest("../employee/list","GET");

            valid = "2px solid green";
            invalid = "2px solid red";
            initial = "2px solid #d6d6c2";
            updated = "2px solid #ff9900";
            active = "#ff9900";

            loadView();
            loadForm();
            loadFormBrand();
            loadFormSubCategory();
            loadFormGeneric();
            loadFormBrandCategory();

            changeTab('table');
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
          var data = httpRequest("/item/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) items = data.content;
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

            tdicode.innerHTML = itmveiw.itemcode;
            tdiname.innerHTML = itmveiw.itemname;
            tdaddate.innerHTML = itmveiw.addeddate;
            tddesc.innerHTML = itmveiw.description;
            tdrop.innerHTML = itmveiw.rop;
            tdroq.innerHTML = itmveiw.roq;
            /* if(item.photo==null)
               tdphoto.src= 'resourse/image/noimage.png';
              else
             tdphoto.src = atob(itmveiw.photo);*/
            tditype.innerHTML = itmveiw.itemtype_id.name;
            tdasign.innerHTML = itmveiw.employee_id.callingname;
            tdbrand.innerHTML = itmveiw.brand_id.name;
            tdcategory.innerHTML = itmveiw.subcategory_id.category_id.name;
            tdsubcategory.innerHTML = itmveiw.subcategory_id.name;
            tdunit.innerHTML = itmveiw.unit_id.name + itmveiw.unit_id.unittype_id.name;
            tdgeneric.innerHTML = itmveiw.generic_id.name;
            tdproducttype.innerHTML = itmveiw.producttype_id.name;
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

         //prescription
         function chPrescripMC() {
            if(chPrescrip.checked){
                item.prescriptionrequired = true;
            }else {
                item.prescriptionrequired = false;
            }

         }

         //load category by itemtype
         function cmbItemTypeCH() {
             categoriesbyitemtype = httpRequest("category/listbyitemtype?itemtypeid="+ JSON.parse(cmbItemType.value).id, "GET")
             fillCombo(cmbCategory,"Select Category",categoriesbyitemtype,"name","");
             cmbItemType.style.border = valid;

             if(olditem != null && olditem.itemtype_id.name != JSON.parse(cmbItemType.value).name){
                 cmbItemType.style.border = updated;
             }else {
                 cmbItemType.style.border = valid;
             }
             cmbBrand.style.border = initial;
             cmbSubcategory.style.border = initial;
             cmbCategory.style.border = initial;
             cmbUnit.style.border = initial;
             cmbGeneric.style.border = initial;
             cmbProductType.style.border = initial;
             txtItemName.style.border = initial;

             item.brand_id = null;
             item.subcategory_id = null;
             item.unit_id = null;
             item.generic_id = null;
             item.producttype_id = null;
             item.itemname = null;
             if (item.subcategory_id != null){
                 item.subcategory_id.category_id = null;
             }


             fillCombo(cmbBrand,"Select Brand",brands,"name","");
             fillCombo(cmbSubcategory,"Select Subcategory",subcategories,"name","");
             fillCombo3(cmbUnit,"Select Unit",units,"name","unittype_id.name","");
             fillCombo(cmbGeneric,"Select Generic Name",generics,"name","");
             fillCombo(cmbProductType,"Select Product Type",producttypes,"name","");

             if(JSON.parse(cmbItemType.value).name == "Grocery"){
                 fillCombo(cmbGeneric,"Select Generic Name",generics,"name","None");
                // cmbGeneric.disabled = true;
                 $('#seelectGeneri .select2-container').removeAttr("style");
                 $("#seelectGeneri .select2-container").css('border',valid);
                 item.generic_id = JSON.parse(cmbGeneric.value);
                 fillCombo(cmbProductType,"Select Product Type",producttypes,"name","Grocery");
                 cmbProductType.disabled = true;
                 item.producttype_id = JSON.parse(cmbProductType.value);;
             }else {
                 cmbGeneric.disabled = false;
                 cmbProductType.disabled = false;
             }
             /*if (cmbUnit.value != null){
             cmbUnitCH();
             }*/
         }

         function cmbUnitCH(){
            if (JSON.parse(cmbItemType.value).name == "Drug"){
                if (JSON.parse(cmbCategory.value).name == "Surgical Items"){
                    txtItemName.value =  JSON.parse(cmbBrand.value).name + " " + JSON.parse(cmbSubcategory.value).name + " " + JSON.parse(cmbUnit.value).name + " " + JSON.parse(cmbUnit.value).unittype_id.name;
                }else {
                    txtItemName.value = JSON.parse(cmbGeneric.value).name + " " + JSON.parse(cmbBrand.value).name + " " + JSON.parse(cmbUnit.value).name + " " + JSON.parse(cmbUnit.value).unittype_id.name;
                }
            }else{
                txtItemName.value = JSON.parse(cmbBrand.value).name + " " + JSON.parse(cmbSubcategory.value).name + " " + JSON.parse(cmbUnit.value).name + " " + JSON.parse(cmbUnit.value).unittype_id.name;
            }
             item.itemname = txtItemName.value;
             if(olditem != null && olditem.itemname != txtItemName.value){
                 txtItemName.style.border = updated;
             }else {
                 txtItemName.style.border = valid;
             }

         }

        function cmbCategoryCH() {

                brandsbycategory = httpRequest("brand/listbycategory?categoryid=" + JSON.parse(cmbCategory.value).id, "GET")
                fillCombo(cmbBrand, "Select Brand", brandsbycategory, "name", "");

                subcategoriesbycategory = httpRequest("subcategory/listbycategory?categoryid=" + JSON.parse(cmbCategory.value).id, "GET")
                fillCombo(cmbSubcategory, "Select Subcategory", subcategoriesbycategory, "name", "");

                cmbCategory.style.border = valid;
                if (olditem != null && olditem.subcategory_id.category_id.name != JSON.parse(cmbCategory.value).name) {
                    cmbCategory.style.border = updated;
                } else {
                    cmbCategory.style.border = valid;
                }

                if (JSON.parse(cmbItemType.value).name == "Drug") {

                    cmbBrand.style.border = initial;
                    cmbSubcategory.style.border = initial;
                    cmbUnit.style.border = initial;
                    cmbGeneric.style.border = initial;
                    cmbProductType.style.border = initial;
                    txtItemName.style.border = initial;

                    item.brand_id = null;
                    item.subcategory_id = null;
                    item.unit_id = null;
                    item.generic_id = null;
                    item.producttype_id = null;
                    item.itemname = null;

                    fillCombo3(cmbUnit, "Select Unit", units, "name", "unittype_id.name", "");
                    fillCombo(cmbGeneric, "Select Generic Name", generics, "name", "");
                    fillCombo(cmbProductType, "Select Product Type", producttypes, "name", "");
                }else {
                        cmbBrand.style.border = initial;
                        cmbSubcategory.style.border = initial;
                        cmbUnit.style.border = initial;
                        txtItemName.style.border = initial;

                        item.brand_id = null;
                        item.subcategory_id = null;
                        item.unit_id = null;
                        item.itemname = null;

                        fillCombo3(cmbUnit, "Select Unit", units, "name", "unittype_id.name", "");
                }

            if (JSON.parse(cmbCategory.value).name == "Surgical Items"){
                fillCombo(cmbGeneric,"Select Generic Name",generics,"name","None");
                $("#seelectGeneri .select2-container").css('border',valid);
                cmbGeneric.disabled = true;
                item.generic_id = JSON.parse(cmbGeneric.value);;
            }
            else {
                cmbGeneric.disabled = false;
            }

           /* if (cmbSubcategory.value != "" ){
                cmbUnitCH();
            }

            if (cmbUnit.value != ""){
                cmbUnitCH();
            }

            if ( cmbGeneric.value != "" ){
                cmbUnitCH();
            }

            if (cmbBrand.value != "" ){
                cmbUnitCH();
            }*/
        }

        function cmbGenericCH() {
            if (cmbCategory.value != ""){
                cmbUnitCH();
            }
        }

        function loadForm() {
            item = new Object();
            olditem = null;

            // fill data into combo
            // fillCombo(feildid, message, datalist, displayproperty, selected value)
             fillCombo(cmbItemType,"Select Item Type",itemtypes,"name","");
             fillCombo(cmbBrand,"Select Brand",brands,"name","");
             fillCombo(cmbSubcategory,"Select Subcategory",subcategories,"name","");
             fillCombo(cmbCategory,"Select Category",categories,"name","");
             fillCombo3(cmbUnit,"Select Unit",units,"name","unittype_id.name","");
             // fillCombo(cmbUnitType,"Select Unit types",unittypes,"name","");
             fillCombo(cmbGeneric,"Select Generic Name",generics,"name","");
             fillCombo(cmbProductType,"Select Product Type",producttypes,"name","");


             // fill and auto select / auto bind
             fillCombo(cmbStatus,"",itemstatuses,"name","Available");
             fillCombo(cmbAssignBy,"",employees,"callingname",session.getObject('activeuser').employeeId.callingname);

             item.itemstatus_id=JSON.parse(cmbStatus.value);
             cmbStatus.disabled = true;

            item.employee_id=JSON.parse(cmbAssignBy.value);
            cmbAssignBy.disabled = true;

            // ceate date object
             var today = new Date();
             // get month --> array(0-11)
             var month = today.getMonth()+1;
             if(month<10) month = "0"+month;// YYYY-MM-DD
            //get date --> range(1-31)
             var date = today.getDate();
             if(date<10) date = "0"+date;// YYYY-MM-DD

            dteAsignDate.value=today.getFullYear()+"-"+month+"-"+date;
             item.addeddate=dteAsignDate.value;
            dteAsignDate.disabled = true;

            // Get Next Number Form Data Base
            var nextNumber = httpRequest("/item/nextnumber", "GET");
            txtItemCode.value = nextNumber.itemcode;
            item.itemcode = txtItemCode.value;
            txtItemCode.disabled="disabled";

            txtRop.value = "50";
            txtRoq.value = "100";
            item.rop = txtRop.value;
            item.roq = txtRoq.value;

            //textfeild empty
             txtItemName.value = "";
             txtItmDescription.value = "";

            chPrescrip.checked = false;
            $('#chPrescrip').bootstrapToggle('off')
            item.prescriptionrequired = false;

             setStyle(initial);

            txtRop.style.border=valid;
            txtRoq.style.border=valid;
            cmbAssignBy.style.border=valid;
            dteAsignDate.style.border=valid;
            cmbStatus.style.border=valid;
            txtItemCode.style.border=valid;

             disableButtons(false, true, true);

        }

        function setStyle(style) {

            txtItemCode.style.border = style;
            cmbItemType.style.border = style;
            // cmbBrand.style.border = style;
            // cmbSubcategory.style.border = style;
            $("#seelectBrand .select2-container").css('border',style);
            $("#seelectSubCategory .select2-container").css('border',style);
            $("#seelectGeneri .select2-container").css('border',style);
            $("#seelectUnit .select2-container").css('border',style);
            cmbCategory.style.border = style;
            // cmbUnit.style.border = style;
            // cmbUnitType.style.border = style;
            // cmbGeneric.style.border = style;
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

            if (add || !privilages.add) {
                btnAdd.setAttribute("disabled", "disabled");
                $('#btnAdd').css('cursor','not-allowed');
            }
            else {
                btnAdd.removeAttribute("disabled");
                $('#btnAdd').css('cursor','pointer')
            }

            if (upd || !privilages.update) {
                btnUpdate.setAttribute("disabled", "disabled");
                $('#btnUpdate').css('cursor','not-allowed');
            }
            else {
                btnUpdate.removeAttribute("disabled");
                $('#btnUpdate').css('cursor','pointer');
             }

            if (!privilages.update) {
                $(".buttonup").prop('disabled', true);
                $(".buttonup").css('cursor','not-allowed');
            }
            else {
                $(".buttonup").removeAttr("disabled");
                $(".buttonup").css('cursor','pointer');
            }

            if (!privilages.delete){
                $(".buttondel").prop('disabled', true);
                $(".buttondel").css('cursor','not-allowed');
            }
            else {
                $(".buttondel").removeAttr("disabled");
                $(".buttondel").css('cursor','pointer');
            }

            // select deleted data row
            for(index in items){
                if(items[index].itemstatus_id.name =="Removed"){
                    tblItem.children[1].children[index].style.color = "#f00";
                    tblItem.children[1].children[index].style.border = "2px solid red";
                    tblItem.children[1].children[index].lastChild.children[1].disabled = true;
                    tblItem.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

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
                    "\nRop : " + item.rop +
                    "\nRoq : " + item.roq +
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

        function loadFormBrand() {

            //categories = httpRequest("../category/list","GET");

            brand = new Object();
            oldbrand = null;

            txtNewBrand.value = "";
            txtNewBrand.style.border = initial;


        }

        function getBrandErrors() {

            var errors = "";
            addvalue = "";

            if (brand.name == null) {
                txtNewBrand.style.border = invalid;
                errors = errors + "\n" + "Brand name not Entered";
            }
            else  addvalue = 1;


            return errors;

        }

        function btnBrandAddMc(){

            if(getBrandErrors()==""){
                savedataBrand();
            }else{
                swal({
                    title: "You have following errors",
                    text: "\n"+getBrandErrors(),
                    icon: "error",
                    button: true,
                });

            }
        }

        function savedataBrand() {

            swal({
                title: "Are you sure to add following Brand...?" ,
                text : "\nCalling name : " + brand.name
                   ,
                icon: "warning",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/brand", "POST",brand);
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
                        loadFormBrand();
                        loadFormBrandCategory();
                        fillbrandname();
                    }
                    else swal({
                        title: 'Save not Success... , You have following errors', icon: "error",
                        text: '\n ' + response,
                        button: true
                    });
                }
            });

        }

        function fillbrandname() {
            newbrands = httpRequest("../brand/list","GET");
            fillCombo(cmbBrand,"Select Brand",newbrands,"name","");
        }

        function loadFormBrandCategory() {

            //categories = httpRequest("../category/list","GET");

            brandhascategory = new Object();
            oldbrandhascategory = null;

            catbrands = httpRequest("../brand/list","GET");
            fillCombo(cmbBrandcat,"Select Brand",catbrands,"name","");
            fillCombo(cmbcategoryBrand, "Select Category", categories, "name", "");

            $("#seelectcategoryBrand .select2-container").css('border',initial);
            $("#seelectcategoryBrand .select2-container").css('border',initial);
            //cmbBrandcat.style.border = initial;
            //cmbcategoryBrand.style.border = initial;

        }

        function getBrandCategoryErrors() {

            var errors = "";
            addvalue = "";

            if (brandhascategory.brand_id == null) {
                cmbBrandcat.style.border = invalid;
                errors = errors + "\n" + "Brand name not Selected";
            }
            else  addvalue = 1;

            if (brandhascategory.category_id == null) {
                cmbcategoryBrand.style.border = invalid;
                errors = errors + "\n" + "Category not Selected";
            }
            else  addvalue = 1;


            return errors;

        }

        function btnBrandCategoryAddMc(){

            if(getBrandCategoryErrors()==""){
                savedataBrandCategory();
            }else{
                swal({
                    title: "You have following errors",
                    text: "\n"+getBrandCategoryErrors(),
                    icon: "error",
                    button: true,
                });

            }
        }

        function savedataBrandCategory() {

            swal({
                title: "Are you sure to add following Brand...?" ,
                text : "\nBrand  : " + brandhascategory.brand_id.name +
                    "\nCategory : " + brandhascategory.category_id.name
                ,
                icon: "warning",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/brandhascategory", "POST",brandhascategory);
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
                        loadFormSubCategory();
                        fillBrandCategoryname();
                    }
                    else swal({
                        title: 'Save not Success... , You have following errors', icon: "error",
                        text: '\n ' + response,
                        button: true
                    });
                }
            });

        }

        function fillBrandCategoryname() {

            brandsbycategory = httpRequest("brand/listbycategory?categoryid="+ JSON.parse(cmbCategory.value).id , "GET")
            fillCombo(cmbBrand,"Select Brand",brandsbycategory,"name","");
        }

        function loadFormSubCategory() {

            //categories = httpRequest("../category/list","GET");

            subcategory = new Object();
            oldsubcategory = null;

            txtNewsubcategory.value = "";

            if (cmbItemType.value != ""){
                ncategoriesbyitemtype = httpRequest("category/listbyitemtype?itemtypeid="+ JSON.parse(cmbItemType.value).id , "GET")
                fillCombo(cmbcategorySub,"Select Category",ncategoriesbyitemtype,"name","");
            }else {
                fillCombo(cmbcategorySub, "Select Category", categories, "name", "");
            }

            txtNewsubcategory.style.border = initial;
            $("#seelectGeneric .select2-container").css('border',initial);
            //cmbcategorySub.style.border = initial;

        }

        function getSubCategoryErrors() {

            var errors = "";
            addvalue = "";

            if (subcategory.name == null) {
                txtNewsubcategory.style.border = invalid;
                errors = errors + "\n" + "Brand name not Entered";
            }
            else  addvalue = 1;

            if (subcategory.category_id == null) {
                cmbcategorySub.style.border = invalid;
                errors = errors + "\n" + "Category not Selected";
            }
            else  addvalue = 1;


            return errors;

        }

        function btnSubCategoryAddMc(){

            if(getSubCategoryErrors()==""){
                savedataSubCategory();
            }else{
                swal({
                    title: "You have following errors",
                    text: "\n"+getSubCategoryErrors(),
                    icon: "error",
                    button: true,
                });

            }
        }

        function savedataSubCategory() {

            swal({
                title: "Are you sure to add following Subcategory...?" ,
                text : "\nSubactegory Name : " + subcategory.name +
                    "\nCategory : " + subcategory.category_id.name
                ,
                icon: "warning",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/subcategory", "POST",subcategory);
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
                        loadFormSubCategory();
                        fillSubCategoryname();
                    }
                    else swal({
                        title: 'Save not Success... , You have following errors', icon: "error",
                        text: '\n ' + response,
                        button: true
                    });
                }
            });

        }

        function fillSubCategoryname() {

            if (cmbCategory.value != ""){
                subcategoriesbycategory = httpRequest("subcategory/listbycategory?categoryid="+ JSON.parse(cmbCategory.value).id , "GET")
                fillCombo(cmbSubcategory,"Select Subcategory",subcategoriesbycategory,"name","");
            }else {
                subcategories = httpRequest("../subcategory/list", "GET");
                fillCombo(cmbSubcategory, "Select Brand", subcategories, "name", "");
            }
        }

        function loadFormGeneric() {

            //categories = httpRequest("../category/list","GET");

            generic = new Object();
            oldgeneric = null;

            txtNewGeneric.value = "";
            txtNewGeneric.style.border = initial;


        }

        function getGenericErrors() {

            var errors = "";
            addvalue = "";

            if (generic.name == null) {
                txtNewGeneric.style.border = invalid;
                errors = errors + "\n" + "Generic name not Entered";
            }
            else  addvalue = 1;


            return errors;

        }

        function btnGenericAddMc(){

            if(getGenericErrors()==""){
                savedataGeneric();
            }else{
                swal({
                    title: "You have following errors",
                    text: "\n"+getGenericErrors(),
                    icon: "error",
                    button: true,
                });

            }
        }

        function savedataGeneric() {

            swal({
                title: "Are you sure to add following Generic Name...?" ,
                text : "\nCalling name : " + generic.name
                ,
                icon: "warning",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/generic", "POST",generic);
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
                        loadFormGeneric();
                        fillGenericname();
                    }
                    else swal({
                        title: 'Save not Success... , You have following errors', icon: "error",
                        text: '\n ' + response,
                        button: true
                    });
                }
            });

        }

        function fillGenericname() {
            newgenerics = httpRequest("../generic/list","GET");
            fillCombo(cmbGeneric,"Select Generic",newgenerics,"name","");
        }

