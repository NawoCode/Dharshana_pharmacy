

 

        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {

            //tooltip enable
            $('[data-toggle="tooltip"]').tooltip()

            // add / clear / update buttons Event Handler
            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);
            btnUpdate.addEventListener("click",btnUpdateMC);
            cmbPackageType.addEventListener("change",cmbPkgCH);

           // cmbUnit.addEventListener("change",cmbUnitCH);

            txtSearchName.addEventListener("keyup",btnSearchMC);

            privilages = httpRequest("../privilage?module=SUBITEM","GET");
    
            itemcodes = httpRequest("../item/listdrug","GET");
            packagrtypes = httpRequest("../packagetype/list","GET");
            subitemstatuses = httpRequest("../subitemstatus/list","GET");
            employees = httpRequest("../employee/list","GET");

            valid = "2px solid green";
            invalid = "2px solid red";
            initial = "2px solid #d6d6c2";
            updated = "2px solid #ff9900";
            active = "#ff9900";

            loadView();
            loadForm();


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
            subitems = new Array();
          var data = httpRequest("/subitem/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) subitems = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblSubItem',subitems,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblSubItem);

            if(activerowno!="")selectRow(tblSubItem,activerowno,active);

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

        function viewitem(sitm,rowno) {

            subitemveiw = JSON.parse(JSON.stringify(sitm));

            tdsicode.innerHTML = subitemveiw.subitemcode;
            tdnoi.innerHTML = subitemveiw.noitem;
            tdsiname.innerHTML = subitemveiw.subitemname;
            tddesc.innerHTML = subitemveiw.description;
            tdaddate.innerHTML = subitemveiw.addeddate;
            /* if(item.photo==null)
               tdphoto.src= 'resourse/image/noimage.png';
              else
             tdphoto.src = atob(item.photo);*/
            tdicode.innerHTML = subitemveiw.item_id.itemcode;
            tdasign.innerHTML = subitemveiw.employee_id.callingname;
            tdpckgtype.innerHTML = subitemveiw.packagetype_id.name;
            tdisstatus.innerHTML = subitemveiw.subitemstatus_id.name;

            $('#dataVeiwModal').modal('show')


         }

         function btnPrintRowMC(){

             var format = printformtable.outerHTML;

             var newwindow=window.open();
             newwindow.document.write("<html>" +
                 "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style>" +
                 "<link rel=\'stylesheet\' href=\'resources/bootstrap/css/bootstrap.min.css\'></head>" +
                 "<body><div style='margin-top: 150px'><h1 style='text-align: center'>Dharshana Pharmacy & Grocery</h1><h2>Sub Item Details :</h2></div>" +
                 "<div>"+format+"</div>" +
                 "<script>printformtable.removeAttribute('style')</script>" +
                 "</body></html>");
             setTimeout(function () {newwindow.print(); newwindow.close();},100);
         }

         function cmbPkgCH(){
             txtSubItemName.value = subitem.item_id.itemname + " " + subitem.packagetype_id.name + "(" + subitem.noitem + ")" ;
             subitem.subitemname = txtSubItemName.value;
             txtSubItemName.style.border = valid;
         }

        function loadForm() {
            subitem = new Object();
            oldsubitem = null;

            // fill data into combo
            // fillCombo(feildid, message, datalist, displayproperty, selected value)
             fillCombo3(cmbItemCode,"Select Itemcode", itemcodes,"itemcode","itemname", "");
             fillCombo(cmbPackageType,"Select Package Type",packagrtypes,"name","");

             // fill and auto select / auto bind
             fillCombo(cmbStatus,"",subitemstatuses,"name","Available");
             fillCombo(cmbAssignBy,"",employees,"callingname",session.getObject('activeuser').employeeId.callingname);

            subitem.subitemstatus_id=JSON.parse(cmbStatus.value);
            cmbStatus.disabled = true;

            subitem.employee_id=JSON.parse(cmbAssignBy.value);
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
            subitem.addeddate=dteAsignDate.value;
            dteAsignDate.disabled = true;

            // Get Next Number Form Data Base
            var nextNumber = httpRequest("/subitem/nextnumber", "GET");
            txtSubItemCode.value = nextNumber.subitemcode;
            subitem.subitemcode = txtSubItemCode.value;
            txtSubItemCode.disabled="disabled";

            //textfeild empty
            txtNoItem.value = "";
            txtSubItemName.value = "";
            txtSubItmDescription.value = "";

             setStyle(initial);

             cmbAssignBy.style.border=valid;
             dteAsignDate.style.border=valid;
             cmbStatus.style.border=valid;
             txtSubItemCode.style.border=valid;

             disableButtons(false, true, true);

        }

        function setStyle(style) {

            txtSubItemCode.style.border = style;
            cmbItemCode.style.border = style;
            txtNoItem.style.border = style;
            cmbPackageType.style.border = style;
            txtSubItemName.style.border = style;
            cmbAssignBy.style.border = style;
            dteAsignDate.style.border = style;
            cmbStatus.style.border = style;
            txtSubItmDescription.style.border = style;


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
            for(index in subitems){
                if(subitems[index].subitemstatus_id.name =="Removed"){
                    tblSubItem.children[1].children[index].style.color = "#f00";
                    tblSubItem.children[1].children[index].style.border = "2px solid red";
                    tblSubItem.children[1].children[index].lastChild.children[1].disabled = true;
                    tblSubItem.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

                }
            }

        }


        function getErrors() {

            var errors = "";
            addvalue = "";

            if (subitem.item_id == null) {
                cmbItemCode.style.border = invalid;
                errors = errors + "\n" + "itemcode Not Selected";
            }
            else  addvalue = 1;

            if (subitem.noitem == null) {
                txtNoItem.style.border = invalid;
                errors = errors + "\n" + "No of item not entered";
            }
            else  addvalue = 1;


            if (subitem.packagetype_id == null) {
                cmbPackageType.style.border = invalid;
                errors = errors + "\n" + "Package Type Not Selected";
            }
            else  addvalue = 1;

            if (subitem.subitemname == null) {
                txtSubItemName.style.border = invalid;
                errors = errors + "\n" + "Sub item name not entered";
            }
            else  addvalue = 1;

            return errors;

        }

        function btnAddMC(){
            if(getErrors()==""){
                if(txtSubItmDescription.value ==""){
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
                title: "Are you sure to add following Subitem...?" ,
                  text :  "\nSubitemcode : " + subitem.subitemcode +
                    "\nItemcode : " + subitem.item_id.itemcode +
                    "\nSubitem name : " + subitem.subitemname +
                    "\nNo of item : " + subitem.noitem +
                    "\nPackage Type : " + subitem.packagetype_id.name +
                    "\nSubitem status : " + subitem.subitemstatus_id.name +
                    "\nDescription : " + subitem.description ,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/subitem", "POST", subitem);
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

            if(oldsubitem == null && addvalue == ""){
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

        function fillForm(sitm,rowno){
            activerowno = rowno;

            if (oldsubitem==null) {
                filldata(sitm);
            } else {
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        filldata(sitm);
                    }

                });
            }

        }

        // Re fill data into form
        function filldata(sitm) {
            clearSelection(tblSubItem);
            selectRow(tblSubItem,activerowno,active);

            subitem = JSON.parse(JSON.stringify(sitm));
            oldsubitem = JSON.parse(JSON.stringify(sitm));

            txtSubItemCode.value = subitem.subitemcode;
            txtSubItemCode.disabled="disabled";
            txtSubItemName.value = subitem.subitemname;
            txtNoItem.value = subitem.noitem;
            dteAsignDate.value = subitem.addeddate;
            txtSubItmDescription.value = subitem.description;


            fillCombo3(cmbItemCode,"Select Itemcode", itemcodes,"itemcode","itemname",subitem.item_id.itemcode);
            fillCombo(cmbPackageType,"Select Package Type",packagrtypes,"name",subitem.packagetype_id.name);
            fillCombo(cmbStatus,"",subitemstatuses,"name",subitem.subitemstatus_id.name);
            cmbStatus.disabled = false;
            fillCombo(cmbAssignBy,"",employees,"callingname",subitem.employee_id.callingname);

            // setDefaultFile('flePhoto', item.photo);

            disableButtons(true, false, false);
            setStyle(valid);
            changeTab('form');

            //  optional feild
            if(subitem.description == null)
                txtSubItmDescription.style.border = initial;

        }

        function getUpdates() {

            var updates = "";

            if(subitem!=null && oldsubitem!=null) {

                if (subitem.subitemcode != oldsubitem.subitemcode)
                    updates = updates + "\nSubitem Code is Changed " + oldsubitem.subitemcode + " into " + subitem.subitemcode;

                if (subitem.item_id.itemcode != oldsubitem.item_id.itemcode)
                    updates = updates + "\nItemcode is Changed " + oldsubitem.item_id.itemcode + " into " + subitem.item_id.itemcode;

                if (subitem.subitemname != oldsubitem.subitemname)
                    updates = updates + "\nSubitem Name is Changed " + oldsubitem.subitemname + " into " + subitem.subitemname;

                if (subitem.noitem != oldsubitem.noitem)
                    updates = updates + "\nNo of item is Changed " + oldsubitem.noitem + " into " + subitem.noitem;

                if (subitem.packagetype_id.name != oldsubitem.packagetype_id.name)
                    updates = updates + "\nPackage Type is Changed " + oldsubitem.packagetype_id.name + " into " + subitem.packagetype_id.name;

                if (subitem.addeddate != oldsubitem.addeddate)
                    updates = updates + "\nAddedd Date is Changed " + oldsubitem.addeddate + " into " + subitem.addeddate;

                if (subitem.description != oldsubitem.description)
                    updates = updates + "\nDescription is Changed " + oldsubitem.description + " into " + subitem.description;

                if (subitem.subitemstatus_id.name != oldsubitem.subitemstatus_id.name)
                    updates = updates + "\nSubitemstatus is Changed " + oldsubitem.subitemstatus_id.name + " into " + subitem.subitemstatus_id.name;
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
                        title: "Are you sure to update following Sub Item details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    })
                        .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/subitem", "PUT", subitem);
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

        function btnDeleteMC(sitm) {
            subitem = JSON.parse(JSON.stringify(sitm));

            swal({
                title: "Are you sure to delete following subitem...?",
                text: "\n Sub Itemcode : " + subitem.subitemcode +
                "\n Subitem Name : " + subitem.subitemname,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/subitem","DELETE",subitem);
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

       function btnPrintTableMC(sitem) {

            var newwindow = window.open();
            formattab = tblSubItem.outerHTML;

           newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
                "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 150px; '> <h1>Sub Items Details : </h1></div>" +
                "<div>"+ formattab+"</div>"+
               "</body>" +
                "</html>");
           setTimeout(function () {newwindow.print(); newwindow.close();},100) ;
        }

        function sortTable(cind) {
            cindex = cind;

         var cprop = tblSubItem.firstChild.firstChild.children[cindex].getAttribute('property');

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
            fillTable('tblSubItem',items,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblSubItem);
            loadForm();

            if(activerowno!="")selectRow(tblSubItem,activerowno,active);



        }