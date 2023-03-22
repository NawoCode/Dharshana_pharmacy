

 

        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {

            //tooltip enable
            $('[data-toggle="tooltip"]').tooltip();

            $('.js-example-basic-single').select2();

            // add / clear / update buttons Event Handler
            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);
            //btnUpdate.addEventListener("click",btnUpdateMC);

            cmbCustomerId.addEventListener("change",cmbCustomerIdCH);
            cmbCorderId.addEventListener("change",cmbCorderIdCH);

            cmbBatchno.addEventListener("change",cmbBatchnoCH);

            txtQuantity.addEventListener("keyup",txtQuantityCH);
            txtDiscount.addEventListener("keyup",txtDiscountRatioCH);

            txtSearchName.addEventListener("keyup",btnSearchMC);

            //customer model
            btnAddMod.addEventListener("click",btnCustomerAddMC);
            btnClearMod.addEventListener("click",btnCustomerClearMC);

            privilages = httpRequest("../privilage?module=INVOICE","GET");

            customers = httpRequest("../customer/listforinvoice","GET");
            corders = httpRequest("../corder/list","GET");
            batches = httpRequest("../batch/batchlist","GET");
            // drugbatches = httpRequest("../batch/drugbatch","GET");
            // grocerybatches = httpRequest("../batch/grocerybatch","GET");
            invoicestatuses = httpRequest("../invoicestatus/list","GET");
            employees = httpRequest("../employee/list","GET");

            //Data list for inner fillcombo box
            groceryitems = httpRequest("../item/listgrocery","GET");
            drugitems = httpRequest("../item/listdrug","GET");

            //data list for customer new mdel
            customertypes = httpRequest("../customertype/list","GET");
            customerststuses = httpRequest("../customerstatus/list","GET");
            genders = httpRequest("../gender/list","GET");

            valid = "2px solid green";
            invalid = "2px solid red";
            initial = "2px solid #d6d6c2";
            updated = "2px solid #ff9900";
            active = "#ff9900";

            loadView();
            loadForm();
            loadCustomerForm();

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
            invoices = new Array();
          var data = httpRequest("/invoice/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) invoices = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblInvoice',invoices,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblInvoice);

            if(activerowno!="")selectRow(tblInvoice,activerowno,active);

        }

        function paginate(page) {
            var paginate;
            if(oldcorder==null){
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

        function viewitem(invo,rowno) {

            invoview = JSON.parse(JSON.stringify(invo));

            tdInvoice.innerHTML = invoview.invoiceno;

            if(invoview.customer_id != null){
                //tdname.innerHTML = invoview.customer_id.callingname;
                tdCcode.innerHTML = invoview.corder_id.cordercode;
                tdcname.innerHTML = invoview.cname;
                tdcmobile.innerHTML = invoview.cmobile;
                tdcnic.innerHTML = invoview.cnic;
            }else {
                //tdname.innerHTML = "-";
                tdCcode.innerHTML = "-";
                tdcname.innerHTML = "-";
                tdcmobile.innerHTML = "-";
                tdcnic.innerHTML = "-";
            }

            tddtGrandAmount.innerHTML = parseFloat(invoview.grandtotal).toFixed(2);
            tddDiscount.innerHTML = parseFloat(invoview.discountratio).toFixed(2) + "%";
            tddNetAmount.innerHTML = parseFloat(invoview.netamount).toFixed(2);

            fillInnerTable("tblPrintInnerDrugItem",invoview.invoiceHasItemsList,innerModify, innerDelete, innerVeiw);

            tdasign.innerHTML = invoview.employee_id.callingname;
            tdaddate.innerHTML = invoview.createddate;
            tdpstatus.innerHTML = invoview.invoicestatus_id.name;
            //tddesc.innerHTML = invoview.description;

            $('#dataVeiwModal').modal('show')

         }

         function btnPrintRowMC(){

             var format = printformtable.outerHTML;

             var newwindow=window.open();
             newwindow.document.write("<html>" +
                 "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style>" +
                 "<link rel=\'stylesheet\' href=\'resources/bootstrap/css/bootstrap.min.css\'></head>" +
                 "<body><div style='margin-top: 150px'><h1 style='text-align: center'>Dharshana Pharmacy & Grocery</h1><h2>Invoice Details :</h2></div>" +
                 "<div>"+format+"</div>" +
                 "<script>printformtable.removeAttribute('style')</script>" +
                 "</body></html>");
             setTimeout(function () {newwindow.print(); newwindow.close();},100);
         }

         function cmbCustomerIdCH() {
             cmbCustomerId.style.border = valid;
             cmbCorderId.disabled = false;

             corderbycustomer = httpRequest("../corder/bycustomer?customerid="+ JSON.parse(cmbCustomerId.value).id ,"GET");
             fillCombo(cmbCorderId,"Select Corder Code", corderbycustomer,"cordercode","");
             cmbCorderId.style.border = initial;

             txtCName.value = JSON.parse(cmbCustomerId.value).callingname;
             txtCMobile.value = JSON.parse(cmbCustomerId.value).mobileno;
             txtCNic.value = JSON.parse(cmbCustomerId.value).nic;

             txtCName.style.border = valid;
             txtCMobile.style.border = valid;
             txtCNic.style.border = valid;

             invoice.cname = txtCName.value;
             invoice.cmobile = txtCMobile.value;
             invoice.cnic = txtCNic.value;

             txtCName.disabled = false;
             txtCMobile.disabled = false;
             txtCNic.disabled = false;

             discountbycustomer = httpRequest("../loyaltypoint/bypoint?point="+ JSON.parse(cmbCustomerId.value).point ,"GET");
             txtDiscount.value = parseFloat(discountbycustomer.discountrate).toFixed(2);
             invoice.discountratio =txtDiscount.value;
             txtDiscount.style.border = valid;
             if (txtGrandAmount.value != 0){
                 console.log(txtGrandAmount.value)
                 txtNetAmount.value = (parseFloat(txtGrandAmount.value) - (parseFloat(txtGrandAmount.value) * parseFloat(txtDiscount.value) / 100)).toFixed(2);
                 //txtDrugLineTotal.style.border = valid;
                 invoice.netamount = txtNetAmount.value;
             }else{
                 txtNetAmount.value = null;
             }

             //if customer name changed
             if(oldinvoice != null && oldinvoice.customer_id.callingname != JSON.parse(cmbCustomerId.value).callingname){

                     cmbCustomerId.style.border = updated;


             }else{
                 cmbCustomerId.style.border = valid;
             }
         }

         function cmbCorderIdCH() {
            if (cmbCustomerId.value != ""){
                batchesbycoder = httpRequest("../batch/listbycrder?coderid="+ JSON.parse(cmbCorderId.value).id ,"GET");
                fillCombo3(cmbBatchno,"Select batch/Item",batchesbycoder,"batchno","item_id.itemname","");
            }else {
                fillCombo3(cmbBatchno,"Select batch/Item",batches,"batchno","item_id.itemname","");
            }

         }

        //if batch no changed
        function cmbBatchnoCH() {

            if(JSON.parse(cmbBatchno.value).item_id.prescriptionrequired==true){
                swal({
                    title: 'You need a prescription for sale this item...',icon: "warning",
                    text: '\n',
                    button: false,
                    timer: 1200});
            }
            txtSalesPrice.value = parseFloat(JSON.parse(cmbBatchno.value).salesprice).toFixed(2);
            console.log(JSON.parse(cmbBatchno.value).salesprice);
            invoiceHasItem.salesprice = txtSalesPrice.value;

            if(cmbCorderId.value != ""){
                corderitems = httpRequest("../corderhasitem/bycorderitem?corderid=" + JSON.parse(cmbCorderId.value).id + "&batchid=" + JSON.parse(cmbBatchno.value).id, "GET");
                txtQuantity.value = corderitems.qty;
                invoiceHasItem.qty = txtQuantity.value;
                txtQuantity.style.border=valid  ;
                txtLineTotal.value = (parseFloat(txtSalesPrice.value) * parseFloat(txtQuantity.value)).toFixed(2);
                //txtDrugLineTotal.style.border = valid;
                invoiceHasItem.linetotal = txtLineTotal.value;
                txtQuantity.disabled=false;
                btnInnerAdd.disabled = false;
            }else {
                txtQuantity.style.border=initial;

                invoiceHasItem.qty = "";
                invoiceHasItem.linetotal = "";
                txtQuantity.value = "";
                txtLineTotal.value = "0.00";

                //txtSalesPrice.disabled=true;
                txtQuantity.disabled=false;
            }

        }

        function txtQuantityCH() {
            var val = txtQuantity.value.trim();
            if (val != ""){
                var regpattern = new RegExp('^[0-9]{1,2}$');
                if (regpattern.test(val)){
                    if(oldinvoiceHasItem != null && oldinvoiceHasItem.qty != txtQuantity.value){
                        txtQuantity.style.border = updated;
                        btnInnerUpdate.disabled = false;
                        btnInnerAdd.disabled = true;
                    }else {
                        btnInnerAdd.disabled = false;
                        btnInnerUpdate.disabled = true;
                    }
                    //btnInnerAdd.disabled = false;
                    txtLineTotal.value = (parseFloat(txtSalesPrice.value) * parseFloat(txtQuantity.value)).toFixed(2);
                    //txtDrugLineTotal.style.border = valid;
                    invoiceHasItem.linetotal = txtLineTotal.value;
                }else {
                    btnInnerAdd.disabled = true;
                    btnInnerUpdate.disabled = true;
                }
            }else {
                btnInnerAdd.disabled = true;
                btnInnerUpdate.disabled = true;
            }
        }

        //calculate net total
        function txtDiscountRatioCH() {

            var val = txtDiscount.value.trim();
            if(val == ""){
                txtNetAmount.value = (parseFloat(txtGrandAmount.value)).toFixed(2);
                //txtDrugLineTotal.style.border = valid;
                invoice.netamount = txtNetAmount.value;
                invoice.discountratio = "0.00";
                txtDiscount.style.border = initial;

            }else {
                //if customer id has value, get discount raio from loyalty table
                if(cmbCustomerId.value != ""){
                    //get discount ratio from loyaltytable
                    discountbycustomer = httpRequest("../loyaltypoint/bypoint?point="+ JSON.parse(cmbCustomerId.value).point ,"GET");
                    txtDiscount.value = parseFloat(discountbycustomer.discountrate).toFixed(2);
                    invoice.discountratio =txtDiscount.value;
                    txtDiscount.style.border = valid;
                    if (txtGrandAmount.value != null){
                        txtNetAmount.value = (parseFloat(txtGrandAmount.value) - (parseFloat(txtGrandAmount.value) * parseFloat(txtDiscount.value) / 100)).toFixed(2);
                        //txtDrugLineTotal.style.border = valid;
                        invoice.netamount = txtNetAmount.value;
                    }else{
                        txtNetAmount.value = "0.00";
                    }
                }else {
                    //type discount ratio
                    var regpattern = new RegExp('^[0-9]{1,2}[.][0-9]{2}$');
                    if (regpattern.test(val)) {
                        if (val == "0.00") {
                            swal({
                                title: 'Discount Ratio must be between 0.01% and 100.00%...', icon: "warning",
                                text: '\n',
                                button: false,
                                timer: 1200
                            });
                            txtDiscount.style.border = invalid;
                            txtNetAmount.value = (parseFloat(txtGrandAmount.value)).toFixed(2);
                            //txtDrugLineTotal.style.border = valid;
                            invoice.netamount = txtNetAmount.value;
                        } else {
                            if (0.01 < txtDiscount.value && txtDiscount.value <= 100.00) {
                                //console.log("true")
                                txtNetAmount.value = (parseFloat(txtGrandAmount.value) - (parseFloat(txtGrandAmount.value) * parseFloat(txtDiscount.value) / 100)).toFixed(2);
                                //txtDrugLineTotal.style.border = valid;
                                invoice.netamount = txtNetAmount.value;
                                invoice.discountratio = txtDiscount.value;
                                if (oldinvoice != null && oldinvoice.discountratio != txtDiscount.value) {
                                    txtDiscount.style.border = updated;

                                } else {
                                    txtDiscount.style.border = valid;
                                }
                            } else {
                                //console.log("false")
                                txtNetAmount.value = (parseFloat(txtGrandAmount.value)).toFixed(2);
                                //txtDrugLineTotal.style.border = valid;
                                invoice.netamount = txtNetAmount.value;
                                invoice.discountratio = null;
                                txtDiscount.style.border = invalid;
                            }
                        }
                    }
                }
            }
            if(oldinvoice != null && invoice.netamount != oldinvoice.netamount){
                txtNetAmount.style.border=updated;
            }else{
                txtNetAmount.style.border=valid   ;
            }
        }

        function loadForm() {

            invoice = new Object();
            oldinvoice = null;

            //create new array
            invoice.invoiceHasItemsList = new Array();

            // fill data into combo
            // fillCombo(feildid, message, datalist, displayproperty, selected value)
             fillCombo(cmbCustomerId,"Select Customer Name", customers,"callingname","");
             fillCombo(cmbCorderId,"Select Corder Code", corders,"cordercode","");

             // fill and auto select / auto bind
             fillCombo(cmbStatus,"",invoicestatuses,"name","Available");
             fillCombo(cmbAssignBy,"",employees,"callingname",session.getObject('activeuser').employeeId.callingname);

            invoice.invoicestatus_id=JSON.parse(cmbStatus.value);
            cmbStatus.disabled = true;

            invoice.employee_id=JSON.parse(cmbAssignBy.value);
            cmbAssignBy.disabled = true;

            dteAddedDate.value=getCurrentDateTime('date');;
            invoice.createddate=dteAddedDate.value;
            dteAddedDate.disabled = true;

            // Get Next Number Form Data Base
            var nextNumber = httpRequest("/invoice/nextnumber", "GET");
            txtInvoiceNo.value = nextNumber.invoiceno;
            invoice.invoiceno = txtInvoiceNo.value;
            txtInvoiceNo.disabled=true;

            //textfeild empty
            cmbCustomerId.value = "";
            cmbCorderId.value = "";
            txtCName.value = "";
            txtCMobile.value = "";
            txtCNic.value = "";
            txtGrandAmount.value = "";
            txtDiscount.value = "";
            txtNetAmount.value = "";
            txtDescription.value = "";

            cmbCorderId.disabled = true;
            txtCName.disabled = true;
            txtCMobile.disabled = true;
            txtCNic.disabled = true;
            txtGrandAmount.disabled = true;
            txtNetAmount.disabled = true;

             setStyle(initial);

            txtInvoiceNo.style.border=valid;
            dteAddedDate.style.border=valid;
            cmbStatus.style.border=valid;
            cmbAssignBy.style.border=valid;

             disableButtons(false, true, true);

             refreshInner();
            loadCustomerForm();
        }

        function setStyle(style) {

            txtInvoiceNo.style.border = style;
            cmbCustomerId.style.border = style;
            $("#seelectCustomerId .select2-container").css('border',style);
            cmbCorderId.style.border = style;
            txtCName.style.border = style;
            txtCMobile.style.border = style;
            txtCNic.style.border = style;
            txtGrandAmount.style.border = style;
            txtDiscount.style.border = style;
            txtNetAmount.style.border = style;
            txtDescription.style.border = style;
            dteAddedDate.style.border = style;
            cmbStatus.style.border = style;
            cmbAssignBy.style.border = style;

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

           /* if (upd || !privilages.update) {
                btnUpdate.setAttribute("disabled", "disabled");
                $('#btnUpdate').css('cursor','not-allowed');
            }
            else {
                btnUpdate.removeAttribute("disabled");
                $('#btnUpdate').css('cursor','pointer');
             }
*/
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
            for(index in invoices){
                tblInvoice.children[1].children[index].lastChild.children[0].style.display = "none";
                tblInvoice.children[1].children[index].lastChild.children[1].style.display = "none";
                if(invoices[index].invoicestatus_id.name =="Removed"){
                    tblInvoice.children[1].children[index].style.color = "#f00";
                    tblInvoice.children[1].children[index].style.border = "2px solid red";
                    tblInvoice.children[1].children[index].lastChild.children[1].disabled = true;
                    tblInvoice.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

                }
            }

        }

        function refreshInner() {
            invoiceHasItem = new Object();
            oldinvoiceHasItem = null;

            btnInnerAdd.disabled = true;
            btnInnerUpdate.disabled = true;

            totalAmount= 0;
            /*type = document.getElementById('chItemType').checked;
            console.log(type);
            chItemType.checked = type;*/

            //chItemTypeCH();

            cmbCorderIdCH();
            //fillCombo3(cmbBatchno,"Select batch/Item",batches,"batchno","item_id.itemname","");

            //cmbBatchno.style.border=initial;
            $("#selectItem .select2-container").css('border',initial);
            txtQuantity.style.border=initial;

            txtSalesPrice.value = "";
            txtQuantity.value = "";
            txtLineTotal.value = "0.00";

            txtSalesPrice.disabled=true;
            txtQuantity.disabled=true;

            // Inner Table
            fillInnerTable("tblInnerDrug",invoice.invoiceHasItemsList,innerModify, innerDelete, true);
            if(invoice.invoiceHasItemsList.length != 0){
                for (var index in invoice.invoiceHasItemsList){
                    totalAmount = (parseFloat(totalAmount) + parseFloat(invoice.invoiceHasItemsList[index].linetotal)).toFixed(2);
                }
                txtGrandAmount.value = totalAmount;
                invoice.grandtotal = txtGrandAmount.value;
                txtDiscountRatioCH();
                if(oldinvoice != null && invoice.grandtotal != oldinvoice.grandtotal){
                    txtGrandAmount.style.border=updated;
                    txtDiscountRatioCH();
                }else{
                    txtGrandAmount.style.border=valid   ;
                }

            }else {
                totalAmount = null;
                txtGrandAmount.value = totalAmount;
                // porder.totalamount = txtTotalAmount.value;
                invoice.grandtotal = null;
                //txtTotalAmount.style.border = invalid;

            }

        }

        function btnInnerAddMc() {

            var itnext = false;
            for(var index in invoice.invoiceHasItemsList){
                if (invoice.invoiceHasItemsList[index].batch_id.item_id.itemname == invoiceHasItem.batch_id.item_id.itemname ){
                    itnext = true;
                    break;
                }
            }

            if(itnext){

                swal({
                    title: 'Already Exit..!',icon: "warning",
                    text: '\n',
                    button: false,
                    timer: 1200});
            }else {
                invoice.invoiceHasItemsList.push(invoiceHasItem);
                refreshInner();
            }
        }

        function btnInnerClearMc() {
            if(invoiceHasItem.batch_id.item_id != null){
                swal({
                    title: "Are you sure to cler innerform?",
                    text: "\n",
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        refreshInner();
                        cmbBatchno.disabled = false;
                    }
                });
            }else {
                refreshInner();
                cmbBatchno.disabled = false;
            }
        }

        function innerModify(ob, innerrowno) {
            innerrow = innerrowno;

            invoiceHasItem = JSON.parse(JSON.stringify(ob));
            oldinvoiceHasItem = JSON.parse(JSON.stringify(ob));

            $('#collapseOne').collapse('show')
            btnInnerUpdate.disabled = false;
            btnInnerAdd.disabled = true;
            if (cmbCustomerId.value != ""){
                batchesbycoder = httpRequest("../batch/listbycrder?coderid="+ JSON.parse(cmbCorderId.value).id ,"GET");
                fillCombo3(cmbBatchno,"Select batch/Item",batchesbycoder,"batchno","item_id.itemname",invoiceHasItem.batch_id.batchno);
            }else {
                fillCombo3(cmbBatchno,"Select batch/Item",batches,"batchno","item_id.itemname",invoiceHasItem.batch_id.batchno);
            }
            fillCombo3(cmbBatchno,"Select batch/Item",batches,"batchno","item_id.itemname",invoiceHasItem.batch_id.batchno);
            /*if(invoiceHasItem.batch_id.item_id.itemtype_id.name== "Drug"){
                chItemType.checked = true;
                $('#chItemType').bootstrapToggle('on');
                fillCombo3(cmbBatchno,"Select batch/Item",drugbatches,"batchno","item_id.itemname",invoiceHasItem.batch_id.batchno);
            }else {
                chItemType.checked = false;
                $('#chItemType').bootstrapToggle('off');
                fillCombo3(cmbBatchno,"Select batch/Item",grocerybatches,"batchno","item_id.itemname",invoiceHasItem.batch_id.batchno);
            }*/

            cmbBatchno.disabled = true;
            txtSalesPrice.value = parseFloat(invoiceHasItem.salesprice).toFixed(2);
            //txtSalesPrice.style.border=valid;
            txtQuantity.value = invoiceHasItem.qty;
            txtQuantity.style.border=valid;
            txtQuantity.disabled = false;
            txtLineTotal.value = parseFloat(invoiceHasItem.linetotal).toFixed(2);
        }

        function btnInnerUpdateMc() {
            invoice.invoiceHasItemsList[innerrow] = invoiceHasItem;
            swal({
                title: 'Updated...!',icon: "warning",
                text: '\n',
                button: false,
                timer: 1200});
            refreshInner();
            cmbBatchno.disabled = false;

        }

        function innerDelete(innerob,innerrow) {

                swal({
                    title: "Are you sure to delete item?",
                    text: "\n" +
                        "Item Name : " + innerob.batch_id.batchno + " "+ innerob.batch_id.item_id.itemname,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        invoice.invoiceHasItemsList.splice(innerrow,1);
                        refreshInner();
                        cmbBatchno.disabled = false;
                    }
                });
        }

        function innerVeiw() {}

        function getErrors() {

            var errors = "";
            addvalue = "";

            if (invoice.grandtotal == null) {
                txtGrandAmount.style.border = invalid;
                errors = errors + "\n" + "Grand Total Not Entered";
            }
            else  addvalue = 1;

            if (invoice.discountratio == null) {
                txtDiscount.style.border = invalid;
                errors = errors + "\n" + "Discount Not Entered";
            }
            else  addvalue = 1;

            if (invoice.netamount == null) {
                txtNetAmount.style.border = invalid;
                errors = errors + "\n" + "Net Amount Not Entered";
            }
            else  addvalue = 1;

            if (invoice.customer_id != null) {
                if (invoice.corder_id == null) {
                    cmbCorderId.style.border = invalid;
                    errors = errors + "\n" + "Corder Code Not Selected";
                }
                else  addvalue = 1;
                if (invoice.cname == null) {
                    txtCName.style.border = invalid;
                    errors = errors + "\n" + "Contact Name Not Entered";
                }
                else  addvalue = 1;
                if (invoice.cmobile == null) {
                    txtCMobile.style.border = invalid;
                    errors = errors + "\n" + "Contact Mobile Not Entered";
                }
                else  addvalue = 1;
                if (invoice.cnic == null) {
                    txtCNic.style.border = invalid;
                    errors = errors + "\n" + "NIC Not Entered";
                }
                else  addvalue = 1;
            }

            if (invoice.invoiceHasItemsList.length == 0 ) {
                cmbBatchno.style.border = invalid;
                errors = errors + "\n" + "Item And Quanity Not Added";
            }
            else  addvalue = 1;

            return errors;

        }

        function btnAddMC(){
            if(getErrors() == ""){
                if(txtDescription.value=="" || cmbCustomerId.value=="" || cmbCorderId.value==""){
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

            var customer = "";
            if(invoice.customer_id != null){
                customer = customer + "\nCorder Code : " + invoice.corder_id.cordercode;
                customer = customer + "\nCustomer Name : " + invoice.cname;
                customer = customer + "\nCustomer Name : " + invoice.cmobile;
                customer = customer + "\nCustomer Name : " + invoice.cnic;
            }

            swal({
                title: "Are you sure to add following Customer Invoice...?" ,
                  text :  "\nInvoice Code : " + invoice.invoiceno +
                      customer +
                    "\nGrand Total : Rs." + invoice.grandtotal +
                    "\nDiscount Ratio : " + invoice.discountratio +"%"+
                    "\nNet Amount : Rs." + invoice.netamount +
                    "\ninvoice Status : " + invoice.invoicestatus_id.name,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/invoice", "POST", invoice);
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

        function btnClearMC(){
            //Get Cofirmation from the User window.confirm();
            checkerr = getErrors();

            if(invoice == null && addvalue == ""){
                loadForm();
                //cmbBatchno.disabled = false;
            }else{
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        loadForm();
                        //cmbBatchno.disabled = false;
                    }

                });
            }

        }

        function fillForm(invo,rowno){
            activerowno = rowno;

            if (oldinvoice==null) {
                filldata(invo);
            } else {
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        filldata(invo);
                    }

                });
            }

        }

        // Re fill data into form
        function filldata(invo) {
            clearSelection(tblInvoice);
            selectRow(tblInvoice,activerowno,active);

            invoice = JSON.parse(JSON.stringify(invo));
            oldinvoice = JSON.parse(JSON.stringify(invo));

            txtInvoiceNo.value = invoice.invoiceno;
            txtInvoiceNo.disabled="disabled";
            txtGrandAmount.value = parseFloat(invoice.grandtotal).toFixed(2);
            txtDiscount.value = parseFloat(invoice.discountratio).toFixed(2);
             txtNetAmount.value = parseFloat(invoice.netamount).toFixed(2);
            dteAddedDate.value = invoice.createddate;
            txtDescription.value = invoice.description;

            if (invoice.customer_id != null){
                fillCombo(cmbCustomerId,"",customers,"callingname",invoice.customer_id.callingname);

                corderbycustomer = httpRequest("../corder/bycustomer?customerid="+ JSON.parse(cmbCustomerId.value).id ,"GET");
                fillCombo(cmbCorderId,"",corderbycustomer,"cordercode",invoice.corder_id.cordercode);

                txtCName.value = invoice.cname;
                txtCMobile.value = invoice.cmobile;
                txtCNic.value = invoice.cnic;
            }else {
                fillCombo(cmbCustomerId,"Select Customer Name",customers,"callingname","");
                cmbCustomerId.disabled = true;
                fillCombo(cmbCorderId,"Select Corder Code",corders,"cordercode","");
                txtCName.value = "";
                txtCMobile.value = "";
                txtCNic.value = "";
            }

            //innerform
            refreshInner();
            $('#collapseTwo').collapse('show')

            fillCombo(cmbStatus,"",invoicestatuses,"name",invoice.invoicestatus_id.name);
            cmbStatus.disabled = false;
            fillCombo(cmbAssignBy,"",employees,"callingname",invoice.employee_id.callingname);

            disableButtons(true, false, false);
            setStyle(valid);
            changeTab('form');

            //  optional feild
            if(invoice.description == null)
                txtDescription.style.border = initial;

            if(invoice.customer_id == null)
                cmbCustomerId.style.border = initial;

            if(invoice.corder_id == null)
                cmbCorderId.style.border = initial;

            if(invoice.cname == null)
                txtCName.style.border = initial;

            if(invoice.cmobile == null)
                txtCMobile.style.border = initial;

            if(invoice.cnic == null)
                txtCNic.style.border = initial;
        }

        function getUpdates() {

            var updates = "";

            if(invoice !=null && oldinvoice!=null) {

                if (invoice.invoiceno != oldinvoice.invoiceno)
                    updates = updates + "\nInvoice Code is Changed " + oldinvoice.invoiceno + " into " + invoice.invoiceno;

                if (oldinvoice.customer_id != null && invoice.customer_id != null){
                    if (invoice.customer_id.callingname != oldinvoice.customer_id.callingname)
                        updates = updates + "\nCustomer Name is Changed " + oldinvoice.customer_id.callingname + " into " + invoice.customer_id.callingname;
                }
                else if (invoice.customer_id != null)
                    updates = updates + "\nCustomer Name is Changed " + " to " + invoice.customer_id.callingname;

                if (oldinvoice.corder_id != null && invoice.corder_id != null){
                    if (invoice.corder_id.cordercode != oldinvoice.corder_id.cordercode)
                        updates = updates + "\nCorer Code is Changed " + oldinvoice.corder_id.cordercode + " into " + invoice.corder_id.cordercode;
                }
                else if (invoice.corder_id != null)
                    updates = updates + "\nCorer Code is Changed " + " to " + invoice.corder_id.cordercode;

                if (invoice.cname != oldinvoice.cname)
                    updates = updates + "\nName is Changed " + oldinvoice.cname + " into " + invoice.cname;

                if (invoice.cmobile != oldinvoice.cmobile)
                    updates = updates + "\nMobile No is Changed " + oldinvoice.cmobile + " into " + invoice.cmobile;

                if (invoice.grandtotal != oldinvoice.grandtotal)
                    updates = updates + "\nGrand Total is Changed " + oldinvoice.grandtotal + " into " + invoice.grandtotal;

                if (invoice.cnic != oldinvoice.cnic)
                    updates = updates + "\nNIC is Changed " + oldinvoice.cnic + " into " + invoice.cnic;

                if (invoice.discountratio != oldinvoice.discountratio)
                    updates = updates + "\nDiscount Ratio is Changed " + oldinvoice.discountratio + " into " + invoice.discountratio;

                if (invoice.netamount != oldinvoice.netamount)
                    updates = updates + "\nNet Total is Changed " + oldinvoice.netamount + " into " + invoice.netamount;

                if (invoice.description != oldinvoice.description)
                    updates = updates + "\nDescription is Changed " + oldinvoice.description + " into " + invoice.description;

                if (invoice.invoicestatus_id.name != oldinvoice.invoicestatus_id.name)
                    updates = updates + "\nInvoice status is Changed " + oldinvoice.invoicestatus_id.name + " into " + invoice.invoicestatus_id.name;
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
                        title: "Are you sure to update following Customer Invoice details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    })
                        .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/invoice", "PUT", invoice);
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
                                    text: 'You have following error \n '+response,
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

        function btnDeleteMC(invo) {
            invoice = JSON.parse(JSON.stringify(invo));

            swal({
                title: "Are you sure to delete following Customer Invoice...?",
                text: "\nInvoice NO : " + invoice.invoiceno,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/invoice","DELETE",invoice);
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
                } loadForm();
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
            formattab = tblInvoice.outerHTML;

           newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
                "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 150px; '> <h1>Customer Invoice Details : </h1></div>" +
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
            fillTable('tblSupplier',suppliers,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblSupplier);
            loadForm();

            if(activerowno!="")selectRow(tblSupplier,activerowno,active);

        }

        function loadCustomerForm() {
            customer = new Object();
            oldcustomer = null;

            // fill data into combo
            // fillCombo(feildid, message, datalist, displayproperty, selected value)
            fillCombo(cmbCusType,"Select Customer Type", customertypes,"name","");
            fillCombo(cmbGender,"Select Gender",genders,"name","");

            // fill and auto select / auto bind
            fillCombo(cmbStatusC,"",customerststuses,"name","Available");
            fillCombo(cmbAssignByC,"",employees,"callingname",session.getObject('activeuser').employeeId.callingname);

            customer.customerstatus_id=JSON.parse(cmbStatusC.value);
            cmbStatusC.disabled = true;

            customer.employee_id=JSON.parse(cmbAssignByC.value);
            cmbAssignByC.disabled = true;

            // ceate date object
            var today = new Date();
            // get month --> array(0-11)
            var month = today.getMonth()+1;
            if(month<10) month = "0"+month;// YYYY-MM-DD
            //get date --> range(1-31)
            var date = today.getDate();
            if(date<10) date = "0"+date;// YYYY-MM-DD

            dteAsignDate.value=today.getFullYear()+"-"+month+"-"+date;
            customer.addeddate=dteAsignDate.value;
            dteAsignDate.disabled = true;

            // Get Next Number Form Data Base
            var nextNumber = httpRequest("/customer/nextnumber", "GET");
            txtRegNo.value = nextNumber.regno;
            customer.regno = txtRegNo.value;
            txtRegNo.disabled="disabled";

            //textfeild empty
            txtCallingName.value = "";
            txtFullName.value = "";
            txtNIC.value = "";
            cmbGender.value = "";
            dteDob.value = "";
            txtCusAddress.value = "";
            txtCusDescription.value = "";
            txtMobile.value = "";
            txtLAnd.value = "";
            txtEmail.value = "";
            cmbCusType.value = "";

            customersetStyle(initial);

            cmbAssignByC.style.border=valid;
            dteAsignDate.style.border=valid;
            cmbStatusC.style.border=valid;
            txtRegNo.style.border=valid;

            disableButtons(false, true, true);

        }

        function customersetStyle(style) {

            txtRegNo.style.border = style;
            txtCallingName.style.border = style;
            txtFullName.style.border = style;
            txtNIC.style.border = style;
            cmbGender.style.border = style;
            dteDob.style.border = style;
            txtCusAddress.style.border = style;
            txtCusDescription.style.border = style;
            txtMobile.style.border = style;
            txtLAnd.style.border = style;
            txtEmail.style.border = style;
            dteAsignDate.style.border = style;
            cmbCusType.style.border = style;
            cmbStatusC.style.border = style;
            cmbAssignByC.style.border = style;



        }

        function nicTestFieldBinder(field,pattern,ob,prop,oldob) {
            var regpattern = new RegExp(pattern);

            var val = field.value.trim();
            if (regpattern.test(val)) {
                var dobyear, gendername,noOfDays = "";
                if (val.length===10){
                    dobyear = "19"+val.substring(0,2);
                    noOfDays = val.substring(2,5);
                }else{
                    dobyear = val.substring(0,4);
                    noOfDays = val.substring(4,7);
                }
                birthdate = new Date(dobyear+"-"+"01-01");
                if (noOfDays>=1 && noOfDays<=366){
                    gendername =  "Male";
                }else if(noOfDays>=501 && noOfDays<=866){
                    noOfDays = noOfDays-500;
                    gendername =  "Female";
                }
                if(gendername=== "Female" ||  gendername ===  "Male"){
                    fillCombo(cmbGender,"Select Gender",genders,"name",gendername);
                    birthdate.setDate(birthdate.getDate()+parseInt(noOfDays)-1)
                    dteDob.value = birthdate.getFullYear()+"-"+getmonthdate(birthdate);

                    customer.gender_id = JSON.parse(cmbGender.value);
                    customer.dob = dteDob.value;
                    customer.nic = field.value;
                    if (oldcustomer != null && oldcustomer.nic != customer.nic){
                        field.style.border=updated;}else {field.style.border=valid;}
                    if (oldcustomer != null && oldcustomer.dob != customer.dob){
                        dteDob.style.border=updated;}else {dteDob.style.border=valid;}
                    if (oldcustomer != null && oldcustomer.gender_id.name != customer.gender_id.name){
                        cmbGender.style.border=updated;}else {cmbGender.style.border=valid;}
                    dteDOBirthCH();
                }else{
                    field.style.border = invalid;
                    cmbGender.style.border = initial;
                    dteDob.style.border = initial;
                    fillCombo(cmbGender,"Select Gender",genders,"name","");
                    dteDob.value = "";
                    customer.nic = null;
                }
            }else{
                field.style.border = invalid;
                customer.nic = null;
            }

        }

        function dteDOBirthCH() {
            var today = new Date();
            var birthday = new Date(dteDob.value);
            if((today.getTime()-birthday.getTime())>(18*365*24*3600*1000)) {
                customer.dob = dteDob.value;
                dteDob.style.border = valid;
            }
            else
            {
                customer.dob = null;
                dteDob.style.border = invalid;
            }
        }

        function getCustomerErrors() {

            var errors = "";
            addvalue = "";

            if (customer.callingname == null) {
                txtCallingName.style.border = invalid;
                errors = errors + "\n" + "Calling name not Entered";
            }
            else  addvalue = 1;

            if (customer.fullname == null) {
                txtFullName.style.border = invalid;
                errors = errors + "\n" + "Full name not Entered";
            }
            else  addvalue = 1;

            if (customer.nic == null) {
                txtNIC.style.border = invalid;
                errors = errors + "\n" + "NIC not Entered";
            }
            else  addvalue = 1;

            if (customer.address == null) {
                txtCusAddress.style.border = invalid;
                errors = errors + "\n" + "Adddress Not Entered";
            }
            else  addvalue = 1;

            if (customer.mobileno == null) {
                txtMobile.style.border = invalid;
                errors = errors + "\n" + "Mobile number not Entered";
            }
            else  addvalue = 1;

            if (customer.email == null) {
                txtEmail.style.border = invalid;
                errors = errors + "\n" + "Email not Entered";
            }
            else  addvalue = 1;

            if (customer.customertype_id == null) {
                cmbCusType.style.border = invalid;
                errors = errors + "\n" + "Customer Type Not Selected";
            }
            else  addvalue = 1;

            return errors;

        }

        function btnCustomerAddMC(){
            if(getCustomerErrors()==""){
                if(txtLAnd.value=="" || txtCusDescription.value ==""){
                    swal({
                        title: "Are you sure to continue...?",
                        text: "Form has some empty fields.....",
                        icon: "warning",
                        buttons: true,
                        dangerMode: true,
                    }).then((willDelete) => {
                        if (willDelete) {
                            savedataCustomer();
                        }
                    });

                }else{
                    savedataCustomer();
                }
            }else{
                swal({
                    title: "You have following errors",
                    text: "\n"+getCustomerErrors(),
                    icon: "error",
                    button: true,
                });

            }
        }

        function savedataCustomer() {

            swal({
                title: "Are you sure to add following Customer...?" ,
                text :  "\nRegno : " + customer.regno +
                    "\nCalling name : " + customer.callingname +
                    "\nFull Name : " + customer.fullname +
                    "\nNIC : " + customer.nic +
                    "\nGender : " + customer.gender_id.name +
                    "\nDate of Birth : " + customer.dob +
                    "\nAddress : " + customer.address +
                    "\nMobile No : " + customer.mobileno +
                    "\nEmail : " + customer.email +
                    "\nCustomer Type : " + customer.customertype_id.name +
                    "\nCustomer Status : " + customer.customerstatus_id.name,
                icon: "warning",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/customer", "POST", customer);
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
                        loadCustomerForm();
                        fillcustomername();
                    }
                    else swal({
                        title: 'Save not Success... , You have following errors', icon: "error",
                        text: '\n ' + response,
                        button: true
                    });
                }
            });

        }

        function fillcustomername() {
            newcustomers = httpRequest("../customer/namelist","GET");
            fillCombo(cmbCustomerId,"Select Customer Name", newcustomers,"callingname","");

        }

        function btnCustomerClearMC() {
            //Get Cofirmation from the User window.confirm();
            checkerr = getCustomerErrors();

            if(oldcustomer == null && addvalue == ""){
                loadCustomerForm();
            }else{
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        loadCustomerForm();
                    }

                });
            }

        }