

 

        window.addEventListener("load", initialize);

        //Initializing Functions

        function initialize() {

            //tooltip enable
            $('[data-toggle="tooltip"]').tooltip()

            // add / clear / update buttons Event Handler
            btnAdd.addEventListener("click",btnAddMC);
            btnClear.addEventListener("click",btnClearMC);
            btnUpdate.addEventListener("click",btnUpdateMC);

            cmbSupName.addEventListener("change",cmbSupNameCH);
            cmbGrnCode.addEventListener("change",cmbGrnCodeCH);
            cmbPaymentMethod.addEventListener("change",cmbPayementTypeCH);
            txtPaidAmount.addEventListener("keyup",txtPaidAmountKU);

            txtSearchName.addEventListener("keyup",btnSearchMC);

            privilages = httpRequest("../privilage?module=SPAYMENT","GET");

            paymethods = httpRequest("../paymethod/listsupplier","GET");
            grns = httpRequest("../grn/list","GET");
            suppliertypes = httpRequest("../itemtype/list","GET");
            drugsuppliers = httpRequest("../supplier/drugnamelist","GET");
            grocerysuppliers = httpRequest("../supplier/grocerynamelist","GET");
            spaymentststuses = httpRequest("../spaymentstatus/list","GET");
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
            spayments = new Array();
          var data = httpRequest("/spayment/findAll?page="+page+"&size="+size+query,"GET");
            if(data.content!= undefined) spayments = data.content;
            createPagination('pagination',data.totalPages, data.number+1,paginate);
            fillTable('tblSupPayment',spayments,fillForm,btnDeleteMC,viewitem);
            clearSelection(tblSupPayment);

            if(activerowno!="")selectRow(tblSupPayment,activerowno,active);

        }

        function paginate(page) {
            var paginate;
            if(oldspayment==null){
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

        function viewitem(spay,rowno) {

            spveiw = JSON.parse(JSON.stringify(spay));

            tdbilno.innerHTML = spveiw.billno;
            tdstype.innerHTML = spveiw.supplier_id.supplytype_id.name;
            tdsname.innerHTML = spveiw.supplier_id.fullname;
            tdgrnamount.innerHTML = parseFloat(spveiw.grnamount).toFixed(2);
            tdtotamount.innerHTML = parseFloat(spveiw.totalamount).toFixed(2);
            tdpaidamount.innerHTML = parseFloat(spveiw.paidamount).toFixed(2);
            tdbalance.innerHTML = parseFloat(spveiw.balancamount).toFixed(2);

            if(spveiw.paymethod_id.name == "Check"){
                tdchpaymethod.innerHTML = spveiw.paymethod_id.name;
                tdcheno.innerHTML = spveiw.chequeno;
                tdcheckdt.innerHTML = spveiw.chequedate;
                $('#tblchech').removeAttr("style");
                $('#tbltrasfer').css("display","none");
                $('#tbldeposit').css("display","none");
            }
            if(spveiw.paymethod_id.name == "Transfer"){
                tdtrpaymethod.innerHTML = spveiw.paymethod_id.name;
                tdtrbnaccname.innerHTML = spveiw.bankaccname;
                tdtrbnaccno.innerHTML = spveiw.banaccno;
                tdtrbnname.innerHTML = spveiw.bankname;
                tdtrbnbrchname.innerHTML = spveiw.bankbranchname;
                tdtrid.innerHTML = spveiw.transferid;
                tdtrdte.innerHTML = spveiw.transferdatetime;
                $('#tbltrasfer').removeAttr("style");
                $('#tblchech').css("display","none");
                $('#tbldeposit').css("display","none");
            }
            if(spveiw.paymethod_id.name == "Deposit"){
                tddepaymethod.innerHTML = spveiw.paymethod_id.name;
                tddebnaccname.innerHTML = spveiw.bankaccname;
                tddebnaccno.innerHTML = spveiw.banaccno;
                tddebnname.innerHTML = spveiw.bankname;
                tddedte.innerHTML = spveiw.transferdatetime;
                $('#tbldeposit').removeAttr("style");
                $('#tbltrasfer').css("display","none");
                $('#tblchech').css("display","none");
            }


            tdgcode.innerHTML = spveiw.grn_id.grncode;
            tdasign.innerHTML = spveiw.employee_id.callingname;
            tdaddate.innerHTML = spveiw.paiddate;
            tdstatus.innerHTML = spveiw.spaymentstatus_id.name;
            tddesc.innerHTML = spveiw.description;

            $('#dataVeiwModal').modal('show')


         }

         function btnPrintRowMC(){

             var format = printformtable.outerHTML;

             var newwindow=window.open();
             newwindow.document.write("<html>" +
                 "<head><style type='text/css'>.google-visualization-table-th {text-align: left;}</style>" +
                 "<link rel=\'stylesheet\' href=\'resources/bootstrap/css/bootstrap.min.css\'></head>" +
                 "<body><div style='margin-top: 150px'><h1 style='text-align: center'>Dharshana Pharmacy & Grocery</h1><h2>Supplier Payment Details :</h2></div>" +
                 "<div>"+format+"</div>" +
                 "<script>printformtable.removeAttribute('style')</script>" +
                 "</body></html>");
             setTimeout(function () {newwindow.print(); newwindow.close();},100);
         }

        function cmbSupTypeCH() {
            cmbSupType.style.border = valid;
            cmbSupName.disabled = false;
            //drug
            if(JSON.parse(cmbSupType.value).name == "Drug"){

                fillCombo(cmbSupName,"Select Supplier Name", drugsuppliers,"fullname","");

                //if supplier type changed
                if(oldspayment != null && oldspayment.supplier_id.supplytype_id.name != JSON.parse(cmbSupType.value).name){
                    cmbSupType.style.border = updated;

                }else{
                    cmbSupType.style.border = valid;
                }
                fillCombo(cmbGrnCode,"Select GRN Code", grns,"grncode","");
                txtGrnAmount.value = null;
                txtTotalAmount.value = null;
                txtPaidAmount.value = null;
                txtBalance.value = null;
                spayment.supplier_id = null;
                spayment.grn_id = null;
                spayment.grnamount = null;
                spayment.totalamount = null;
                spayment.paidamount = null;
                spayment.balancamount = null;
                cmbSupName.style.border = initial;
                cmbGrnCode.style.border = initial;
                txtGrnAmount.style.border = initial;
                txtTotalAmount.style.border = initial;
                txtPaidAmount.style.border = initial;
                txtBalance.style.border = initial;

                //grocery
            }else{
                fillCombo(cmbSupName,"Select Supplier Name", grocerysuppliers,"fullname","");
                fillCombo(cmbGrnCode,"Select GRN Code", grns,"grncode","");
                txtGrnAmount.value = null;
                txtTotalAmount.value = null;
                txtPaidAmount.value = null;
                txtBalance.value = null;
                spayment.supplier_id = null;
                spayment.grn_id = null;
                spayment.grnamount = null;
                spayment.totalamount = null;
                spayment.paidamount = null;
                spayment.balancamount = null;
                cmbSupName.style.border = initial;
                cmbGrnCode.style.border = initial;
                txtGrnAmount.style.border = initial;
                txtTotalAmount.style.border = initial;
                txtPaidAmount.style.border = initial;
                txtBalance.style.border = initial;
            }

        }

        function cmbSupNameCH() {
            cmbSupName.style.border = valid;
            cmbGrnCode.disabled = false;

            //if supplier name changed
            if(oldspayment != null && oldspayment.supplier_id.fullname != JSON.parse(cmbSupName.value).name){
                cmbSupName.style.border = updated;

            }else{
                cmbSupName.style.border = valid;
            }
            cmbGrnCode.style.border = initial;
            txtGrnAmount.style.border = initial;
            txtPaidAmount.style.border = initial;
            //txtBalance.style.border = initial;
            txtGrnAmount.value = null;
            txtPaidAmount.value = null;
            spayment.grn_id = null;
            spayment.grnamount = null;
            spayment.paidamount = null;
            //get grn list by supplier name
            grnsbysupplier = httpRequest("../grn/listbysupplier?supplierid="+ JSON.parse(cmbSupName.value).id ,"GET");
            fillCombo(cmbGrnCode,"Select GRN Code", grnsbysupplier,"grncode","");
            //supplier aresamount--> total amount and balance
            if(JSON.parse(cmbSupName.value).arreaseamount != null) {
                txtTotalAmount.value = parseFloat(JSON.parse(cmbSupName.value).arreaseamount).toFixed(2);
                spayment.totalamount = txtTotalAmount.value;
                txtTotalAmount.style.border = valid;
                txtBalance.value = txtTotalAmount.value;
                spayment.balancamount = txtTotalAmount.value;
                txtBalance.style.border = valid;
            }else { //if areas amount is null
                txtTotalAmount.value = "0.00"
                spayment.totalamount = txtTotalAmount.value;
                txtTotalAmount.style.border = valid;
                txtBalance.value = txtTotalAmount.value;
                spayment.balancamount = txtTotalAmount.value;
                txtBalance.style.border = valid;
            }

            if (cmbGrnCode.value == ""){
                txtGrnAmount.value = "0.00";
                spayment.grnamount = txtGrnAmount.value;
                //txtGrnAmount.style.border = initial;
            }

        }

        function cmbGrnCodeCH() {
            cmbGrnCode.style.border = valid;

            //if grncode name changed
            if(oldspayment != null && oldspayment.grn_id.grncode != JSON.parse(cmbGrnCode.value).grncode){
                cmbGrnCode.style.border = updated;

            }else{
                cmbGrnCode.style.border = valid;
            }
            //auto fill grn amount
            txtGrnAmount.value = parseFloat(JSON.parse(cmbGrnCode.value).nettotal).toFixed(2);
            spayment.grnamount = txtGrnAmount.value;
            if(oldspayment != null && oldspayment.grn_id.grnamount != JSON.parse(cmbGrnCode.value).nettotal){
                txtGrnAmount.style.border = updated;

            }else{
                txtGrnAmount.style.border = valid;
            }

            //total amount = grn amount + arreaseamount
                txtTotalAmount.value = (parseFloat(JSON.parse(cmbGrnCode.value).nettotal) + parseFloat(JSON.parse(cmbSupName.value).arreaseamount)).toFixed(2);
                spayment.totalamount = txtTotalAmount.value;
                if (oldspayment != null && oldspayment.totalamount != txtTotalAmount.value) {
                    txtTotalAmount.style.border = updated;

                } else {
                    txtTotalAmount.style.border = valid;
                }


            //balance = total amount
            txtBalance.value = txtTotalAmount.value;
            spayment.balancamount = txtTotalAmount.value;
            if(oldspayment != null && oldspayment.balancamount != txtBalance.value){
                txtBalance.style.border = updated;

            }else{
                txtBalance.style.border = valid;
            }

            txtPaidAmountKU();

        }

        function txtPaidAmountKU() {
            var val = txtPaidAmount.value.trim();
            if(val != ""){
                var regpattern = new RegExp('^[0-9]{1,6}[.][0-9]{2}$');
                if (regpattern.test(val)) {
                    if(val == "0.00") {
                        swal({
                            title: 'Paid Amount cannot be "0"..!', icon: "warning",
                            text: '\n',
                            button: false,
                            timer: 1200
                        });
                        txtPaidAmount.style.border = invalid;
                        spayment.paidamount = null;
                        txtPaidAmount.value = "";
                    }else {
                        var totalamount = (parseFloat(txtTotalAmount.value));
                        var paidamount = (parseFloat(val));
                        if (totalamount >= paidamount) {
                            txtBalance.value = (parseFloat(txtTotalAmount.value) - parseFloat(txtPaidAmount.value)).toFixed(2);
                            spayment.balancamount = txtBalance.value;
                            if(oldspayment != null && oldspayment.balancamount != txtBalance.value){
                                txtBalance.style.border = updated;

                            }else{
                                txtBalance.style.border = valid;
                            }
                            //txtBalance.style.border = valid;
                        } else {
                            swal({
                                title: 'Total Amount Exceed..!', icon: "warning",
                                text: '\n',
                                button: false,
                                timer: 1200
                            });
                            txtPaidAmount.style.border = invalid;
                            spayment.paidamount = null;
                        }
                    }
                }
            }
            else {
                txtBalance.value = (parseFloat(txtTotalAmount.value)).toFixed(2);
                spayment.balancamount = txtBalance.value;
                txtBalance.style.border = valid;
            }

        }

         function cmbPayementTypeCH() {
             if(JSON.parse(cmbPaymentMethod.value).name == "Check"){
                 chequeForm.style.display ="block";
                 transferForm.style.display = "none";
                 depositForm.style.display = "none";

                 spayment.bankaccname = "";
                 spayment.banaccno = "";
                 spayment.bankname = "";
                 spayment.bankbranchname = "";
                 spayment.transferid = "";
                 spayment.transferdatetime = "";

                 txtBnkAccNameTrans.value = "";
                 txtBnkAccNoTrans.value = "";
                 txtBnkNameTrans.value = "";
                 txtBnkBranchName.value = "";
                 txtTransferId.value = "";
                 txtGTransDteNTimeTrans.value = "";
                 txtBnkAccNameDep.value = "";
                 txtBnkAccNoDep.value = "";
                 txtBnkNameDep.value = "";
                 txtGTransDteNTimeDep.value = "";
             }
             else if (JSON.parse(cmbPaymentMethod.value).name == "Transfer"){
                 chequeForm.style.display ="none";
                 transferForm.style.display = "block";
                 depositForm.style.display = "none";

                 spayment.chequeno = "";
                 spayment.chequedate = "";

                 txtCheckNo.value = "";
                 dteCheck.value = "";
                 txtBnkAccNameDep.value = "";
                 txtBnkAccNoDep.value = "";
                 txtBnkNameDep.value = "";
                 txtGTransDteNTimeDep.value = "";
             }
             else {
                 chequeForm.style.display ="none";
                 transferForm.style.display = "none";
                 depositForm.style.display = "block";

                 spayment.chequeno = "";
                 spayment.chequedate = "";
                 spayment.bankbranchname = "";
                 spayment.transferid = "";

                 txtCheckNo.value = "";
                 dteCheck.value = "";
                 txtBnkAccNameTrans.value = "";
                 txtBnkAccNoTrans.value = "";
                 txtBnkNameTrans.value = "";
                 txtBnkBranchName.value = "";
                 txtTransferId.value = "";
                 txtGTransDteNTimeTrans.value = "";

             }
         }

        function loadForm() {
            spayment = new Object();
            oldspayment = null;

            // fill data into combo
            // fillCombo(feildid, message, datalist, displayproperty, selected value)
            fillCombo(cmbSupType,"Select Supplier Type", suppliertypes,"name","");
            fillCombo(cmbSupName,"Select Supplier Name", drugsuppliers,"fullname","");
            fillCombo(cmbPaymentMethod,"Select Payment Method", paymethods,"name","");
            fillCombo(cmbGrnCode,"Select GRN Code", grns,"grncode","");

            // fill and auto select / auto bind
            fillCombo(cmbStatus,"Select Status",spaymentststuses,"name","Available");
            fillCombo(cmbAssignBy,"Select employee",employees,"callingname",session.getObject('activeuser').employeeId.callingname);

            spayment.spaymentstatus_id=JSON.parse(cmbStatus.value);
            cmbStatus.disabled = true;

            spayment.employee_id=JSON.parse(cmbAssignBy.value);
            cmbAssignBy.disabled = true;

            dtePaidDate.value=getCurrentDateTime('date');
            spayment.paiddate=dtePaidDate.value;
            dtePaidDate.disabled = true;

            // Get Next Number Form Data Base
            var nextNumber = httpRequest("/spayment/nextnumber", "GET");
            txtBillNo.value = nextNumber.billno;
            spayment.billno = txtBillNo.value;
            txtBillNo.disabled="disabled";

            //textfeild empty
            cmbSupType.value = "";
            cmbSupName.value = "";
            cmbGrnCode.value = "";
            txtGrnAmount.value = "";
            txtTotalAmount.value = "";
            txtPaidAmount.value = "";
            txtBalance.value = "";
            cmbPaymentMethod.value = "";
            txtCheckNo.value = "";
            dteCheck.value = "";
            txtBnkAccNameTrans.value = "";
            txtBnkAccNoTrans.value = "";
            txtBnkNameTrans.value = "";
            txtBnkBranchName.value = "";
            txtGTransDteNTimeTrans.value = "";
            txtBnkAccNameDep.value = "";
            txtBnkAccNoDep.value = "";
            txtBnkNameDep.value = "";
            txtTransferId.value = "";
            txtGTransDteNTimeDep.value = "";

            cmbSupType.disabled = false;
            cmbPaymentMethod.disabled = false;
            cmbSupName.disabled = true;
            cmbGrnCode.disabled = true;
            txtGrnAmount.disabled = true;
            txtTotalAmount.disabled = true;
            txtBalance.disabled = true;

            setStyle(initial);

            cmbAssignBy.style.border=valid;
            dtePaidDate.style.border=valid;
            cmbStatus.style.border=valid;
            txtBillNo.style.border=valid;

            chequeForm.style.display ="none";
            transferForm.style.display = "none";
            depositForm.style.display = "none";

             disableButtons(false, true, true);

        }

        function setStyle(style) {

            txtBillNo.style.border = style;
            cmbSupType.style.border = style;
            cmbSupName.style.border = style;
            cmbGrnCode.style.border = style;
            txtGrnAmount.style.border = style;
            txtTotalAmount.style.border = style;
            txtPaidAmount.style.border = style;
            txtBalance.style.border = style;
            dtePaidDate.style.border = style;
            cmbPaymentMethod.style.border = style;
            cmbStatus.style.border = style;
            txtCheckNo.style.border = style;
            dteCheck.style.border = style;
            txtBnkAccNameTrans.style.border = style;
            txtBnkAccNoTrans.style.border = style;
            txtBnkNameTrans.style.border = style;
            txtBnkBranchName.style.border = style;
            txtGTransDteNTimeTrans.style.border = style;
            txtBnkAccNameDep.style.border = style;
            txtBnkAccNoDep.style.border = style;
            txtBnkNameDep.style.border = style;
            txtTransferId.style.border = style;
            txtGTransDteNTimeDep.style.border = style;

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
             }*/

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
            for(index in spayments){
                //tblSupPayment.children[1].children[index].lastChild.children[0].style.display = "none";
                tblSupPayment.children[1].children[index].lastChild.children[1].style.display = "none";
                if(spayments[index].spaymentstatus_id.name =="Removed"){
                    tblSupPayment.children[1].children[index].style.color = "#f00";
                    tblSupPayment.children[1].children[index].style.border = "2px solid red";
                    tblSupPayment.children[1].children[index].lastChild.children[1].disabled = true;
                    tblSupPayment.children[1].children[index].lastChild.children[1].style.cursor = "not-allowed";

                }
            }

        }

        function getErrors() {

            var errors = "";
            addvalue = "";

            if (cmbSupType.value == "") {
                cmbSupType.style.border = invalid;
                errors = errors + "\n" + "Supplier Type Not Selected";
            }
            else  addvalue = 1;

            if (spayment.supplier_id == null) {
                cmbSupName.style.border = invalid;
                errors = errors + "\n" + "Supplier Name Not Enter";
            }
            else  addvalue = 1;

            if (spayment.totalamount == null) {
                txtTotalAmount.style.border = invalid;
                errors = errors + "\n" + "Total Amount Not Entered";
            }
            else  addvalue = 1;

            if (spayment.paidamount == null) {
                txtPaidAmount.style.border = invalid;
                errors = errors + "\n" + "Paid Amount not Entered";
            }
            else  addvalue = 1;

            if (spayment.balancamount == null) {
                txtBalance.style.border = invalid;
                errors = errors + "\n" + "Balance Amount not Entered";
            }
            else  addvalue = 1;

            if (spayment.paymethod_id == null) {
                cmbPaymentMethod.style.border = invalid;
                errors = errors + "\n" + "Pay method Not Selected";
            }
            else {
                addvalue = 1;

                if (JSON.parse(cmbPaymentMethod.value).name == "Check") {
                    if (spayment.chequeno == null) {
                        txtCheckNo.style.border = invalid;
                        errors = errors + "\n" + "Cheque Number Not Entered";
                    } else addvalue = 1;

                    if (spayment.chequedate == null) {
                        dteCheck.style.border = invalid;
                        errors = errors + "\n" + "Cheque Date Not Entered";
                    } else addvalue = 1;
                }

                else if (JSON.parse(cmbPaymentMethod.value).name == "Transfer") {
                    if (spayment.bankaccname == null) {
                        txtBnkAccNameTrans.style.border = invalid;
                        errors = errors + "\n" + "Bank Acc Name Not Entered";
                    } else addvalue = 1;

                    if (spayment.banaccno == null) {
                        txtBnkAccNoTrans.style.border = invalid;
                        errors = errors + "\n" + "Bank Acc Number Not Entered";
                    } else addvalue = 1;

                    if (spayment.bankname == null) {
                        txtBnkNameTrans.style.border = invalid;
                        errors = errors + "\n" + "Bank Name Not Entered";
                    } else addvalue = 1;

                    if (spayment.bankbranchname == null) {
                        txtBnkBranchName.style.border = invalid;
                        errors = errors + "\n" + "Bank ranch Name Not Entered";
                    } else addvalue = 1;

                    if (spayment.transferid == null) {
                        txtTransferId.style.border = invalid;
                        errors = errors + "\n" + "Transfer Id Not Entered";
                    } else addvalue = 1;

                    if (spayment.transferdatetime == null) {
                        txtGTransDteNTimeTrans.style.border = invalid;
                        errors = errors + "\n" + "Transfer Date Time Not Entered";
                    } else addvalue = 1;
                }

                else {
                    if (spayment.bankaccname == null) {
                        txtBnkAccNameDep.style.border = invalid;
                        errors = errors + "\n" + "Bank Acc Name Not Entered";
                    } else addvalue = 1;

                    if (spayment.banaccno == null) {
                        txtBnkAccNoDep.style.border = invalid;
                        errors = errors + "\n" + "Bank Acc Number Not Entered";
                    } else addvalue = 1;

                    if (spayment.bankname == null) {
                        txtBnkNameDep.style.border = invalid;
                        errors = errors + "\n" + "Bank Name Not Entered";
                    } else addvalue = 1;

                    if (spayment.transferdatetime == null) {
                        txtGTransDteNTimeDep.style.border = invalid;
                        errors = errors + "\n" + "Transfer Date Time Not Entered";
                    } else addvalue = 1;
                }
            }

            return errors;

        }

        function btnAddMC(){
            if(getErrors()==""){
                if(txtDescription.value =="" || cmbGrnCode.value ==""){
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

            var grn = "";
            if(grn.grn_id != null){
                grn = "\nGRN Code : " + spayment.grn_id.grncode;
                grn = "\nGRN Amount : " + spayment.grnamount;
            }

            var cheque = "";
            if(spayment.paymethod_id.name == "Check"){
                cheque = cheque + "\nCheque Number : " + spayment.chequeno;
                cheque = cheque + "\nCheque Date : " + spayment.chequedate;
            }

            var transfer = "";
            if(spayment.paymethod_id.name == "Transfer"){
                transfer = transfer + "\nBank Acc Name : " + spayment.bankaccname;
                transfer = transfer + "\nBank Acc Number : " + spayment.banaccno;
                transfer = transfer + "\nBank Name Not : " + spayment.bankname;
                transfer = transfer + "\nBank ranch Name : " + spayment.bankbranchname;
                transfer = transfer + "\nTransfer Id : " + spayment.transferid;
                transfer = transfer + "\nTransfer Date Time : " + spayment.transferdatetime;
            }

            var deposit = "";
            if(spayment.paymethod_id.name == "Deposit"){
                deposit = deposit + "\nBank Acc Name : " + spayment.bankaccname;
                deposit = deposit + "\nBank Acc Number : " + spayment.banaccno;
                deposit = deposit + "\nBank Name Not : " + spayment.bankname;
                deposit = deposit + "\nTransfer Date Time : " + spayment.transferdatetime;
            }

            swal({
                title: "Are you sure to add following Supplier Payment...?" ,
                  text :  "\nBill No: " + spayment.billno +
                      "\nSupplier Type : " + spayment.supplier_id.supplytype_id.name +
                      "\nSupplier Name : " + spayment.supplier_id.fullname +
                      grn +
                      "\nPay Method : " + spayment.paymethod_id.name +
                      cheque +
                      transfer +
                      deposit +
                    "\nSpayment Status : " + spayment.spaymentstatus_id.name,
                icon: "warning",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete) {
                    var response = httpRequest("/spayment", "POST", spayment);
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

            if(oldspayment == null && addvalue == ""){
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

        function fillForm(spay,rowno){
            activerowno = rowno;

            if (oldspayment==null) {
                filldata(spay);
            } else {
                swal({
                    title: "Form has some values, updates values... Are you sure to discard the form ?",
                    text: "\n" ,
                    icon: "warning", buttons: true, dangerMode: true,
                }).then((willDelete) => {
                    if (willDelete) {
                        filldata(spay);
                    }

                });
            }

        }

        // Re fill data into form
        function filldata(spay) {
            clearSelection(tblSupPayment);
            selectRow(tblSupPayment,activerowno,active);

            spayment = JSON.parse(JSON.stringify(spay));
            oldspayment = JSON.parse(JSON.stringify(spay));

            txtBillNo.value = spayment.billno;
            txtBillNo.disabled="disabled";
            txtGrnAmount.value = parseFloat(spayment.grnamount).toFixed(2);
            txtTotalAmount.value = parseFloat(spayment.totalamount).toFixed(2);
            txtPaidAmount.value = parseFloat(spayment.paidamount).toFixed(2);
            txtBalance.value = parseFloat(spayment.balancamount).toFixed(2);
            dtePaidDate.value = spayment.paiddate;
            txtDescription.value = spayment.description;

            fillCombo(cmbSupType,"Select Supplier Type", suppliertypes,"name",spayment.supplier_id.supplytype_id.name);
            cmbSupType.disabled = true;

            if(spayment.supplier_id.supplytype_id.name == "Drug"){
                fillCombo(cmbSupName,"Select Supplier Name", drugsuppliers,"fullname",spayment.supplier_id.fullname);}
            else {
                fillCombo(cmbSupName,"Select Supplier Name", grocerysuppliers,"fullname",spayment.supplier_id.fullname);}
            cmbSupName.disabled = true;

            if(spayment.grn_id != null){
                grnsbysupplier = httpRequest("../grn/listbysupplier?supplierid="+ JSON.parse(cmbSupName.value).id ,"GET");
                fillCombo(cmbGrnCode,"Select GRN Code", grnsbysupplier,"grncode",spayment.grn_id.grncode);
            }else {
                grnsbysupplier = httpRequest("../grn/listbysupplier?supplierid="+ JSON.parse(cmbSupName.value).id ,"GET");
                fillCombo(cmbGrnCode,"Select GRN Code", grnsbysupplier,"grncode","");
            }
            cmbGrnCode.disabled = false;

            fillCombo(cmbPaymentMethod,"Select Pay Method", paymethods,"name",spayment.paymethod_id.name);
            cmbPaymentMethod.disabled = true;

            //pay method if check
            if(spayment.paymethod_id.name == "Check"){
                txtCheckNo.value = spayment.chequeno;
                dteCheck.value = spayment.chequedate;

                //cmbPayementTypeCH();
                chequeForm.style.display ="block";
                transferForm.style.display = "none";
                depositForm.style.display = "none";
            }
            //transfer
            else if (spayment.paymethod_id.name == "Transfer"){
                txtBnkAccNameTrans.value = spayment.bankaccname;
                txtBnkAccNoTrans.value = spayment.banaccno;
                txtBnkNameTrans.value = spayment.bankname;
                txtBnkBranchName.value = spayment.bankbranchname;
                txtTransferId.value = spayment.transferid;
                txtGTransDteNTimeTrans.value = spayment.transferdatetime;

                chequeForm.style.display ="none";
                transferForm.style.display = "block";
                depositForm.style.display = "none";
            }//deposit
            else {
                txtBnkAccNameDep.value = spayment.bankaccname;
                txtBnkAccNoDep.value = spayment.banaccno;
                txtBnkNameDep.value = spayment.bankname;
                txtGTransDteNTimeDep.value = spayment.transferdatetime;

                chequeForm.style.display ="none";
                transferForm.style.display = "none";
                depositForm.style.display = "block";
            }

            fillCombo(cmbStatus,"",spaymentststuses,"name",spayment.spaymentstatus_id.name);
            cmbStatus.disabled = false;
            fillCombo(cmbAssignBy,"",employees,"callingname",spayment.employee_id.callingname);

            // setDefaultFile('flePhoto', customer.photo);

            disableButtons(true, false, false);
            setStyle(valid);
            changeTab('form');

            //  optional feild
            if(spayment.description == null)
                txtDescription.style.border = initial;

            if(spayment.grn_id == null)
                cmbGrnCode.style.border = initial;

        }

        function getUpdates() {

            var updates = "";

            if(spayment!=null && oldspayment!=null) {

                if (spayment.billno != oldspayment.billno)
                    updates = updates + "\nBill No is Changed " + oldspayment.billno + " into " + spayment.billno;

                if (spayment.supplier_id.supplytype_id.name != oldspayment.supplier_id.supplytype_id.name)
                    updates = updates + "\nSupplier Type is Changed " + oldspayment.supplier_id.supplytype_id.name + " into " + spayment.supplier_id.supplytype_id.name;

                if (spayment.supplier_id.fullname != oldspayment.fullname)
                    updates = updates + "\nSupplier Name is Changed " + oldspayment.supplier_id.fullname + " into " + spayment.supplier_id.fullname;

                if (oldspayment.grn_id != null && spayment.grn_id != null){
                    if (spayment.grn_id.grncode != oldspayment.grn_id.grncode)
                        updates = updates + "\nGRN Code is Changed " + oldspayment.grn_id.grncode + " into " + spayment.grn_id.grncode;
                }
                else if (spayment.grn_id != null)
                    updates = updates + "\nGRN Code is Changed " + " to " + spayment.grn_id.grncode;

                if (spayment.grnamount != oldspayment.grnamount)
                    updates = updates + "\nGRN Amount is Changed " + oldspayment.grnamount + " into " + spayment.grnamount;

                if (spayment.totalamount != oldspayment.totalamount)
                    updates = updates + "\nTotal Amount is Changed " + oldspayment.totalamount + " into " + spayment.totalamount;

                if (spayment.paidamount != oldspayment.paidamount)
                    updates = updates + "\nPaid Amount is Changed " + oldspayment.paidamount + " into " + spayment.paidamount;

                if (spayment.balancamount != oldspayment.balancamount)
                    updates = updates + "\nBalance Amount is Changed " + oldspayment.balancamount + " into " + spayment.balancamount;

                if (spayment.paymethod_id.name != oldspayment.paymethod_id.name)
                    updates = updates + "\nPay Method is Changed " + oldspayment.paymethod_id.name + " into " + spayment.paymethod_id.name;

                if (spayment.chequeno != oldspayment.chequeno)
                    updates = updates + "\nCheque No is Changed " + oldspayment.chequeno + " into " + spayment.chequeno;

                if (spayment.chequedate != oldspayment.chequedate)
                    updates = updates + "\nCheck Date is Changed " + oldspayment.chequedate + " into " + spayment.chequedate;

                if (spayment.bankaccname != oldspayment.bankaccname)
                    updates = updates + "\nBank Account Name is Changed " + oldspayment.bankaccname + " into " + spayment.bankaccname;

                if (spayment.banaccno != oldspayment.banaccno)
                    updates = updates + "\nBank  Account Number is Changed " + oldspayment.banaccno + " into " + spayment.banaccno;

                if (spayment.bankname != oldspayment.bankname)
                    updates = updates + "\nBank Name is Changed " + oldspayment.bankname + " into " + spayment.bankname;

                if (spayment.bankbranchname != oldspayment.bankbranchname)
                    updates = updates + "\nBank Branch Name is Changed " + oldspayment.bankbranchname + " into " + spayment.bankbranchname;

                if (spayment.transferid != oldspayment.transferid)
                    updates = updates + "\nTransfer ID is Changed " + oldspayment.transferid + " into " + spayment.transferid;

                if (spayment.transferdatetime != oldspayment.transferdatetime)
                    updates = updates + "\nTransfer Date & Time is Changed " + oldspayment.transferdatetime + " into " + spayment.transferdatetime;

                if (spayment.paiddate != oldspayment.paiddate)
                    updates = updates + "\nPaid Date is Changed " + oldspayment.paiddate + " into " + spayment.paiddate;

                if (spayment.description != oldspayment.description)
                    updates = updates + "\nDescription is Changed " + oldspayment.description + " into " + spayment.description;

                if (spayment.spaymentstatus_id.name != oldspayment.spaymentstatus_id.name)
                    updates = updates + "\nPayment status is Changed " + oldspayment.spaymentstatus_id.name + " into " + spayment.spaymentstatus_id.name;
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
                        title: "Are you sure to update following Payment details...?",
                        text: "\n"+ getUpdates(),
                        icon: "warning", buttons: true, dangerMode: true,
                    })
                        .then((willDelete) => {
                        if (willDelete) {
                            var response = httpRequest("/spayment", "PUT", spayment);
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
                                    text: 'You ave following error \n '+response,
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

        function btnDeleteMC(spay) {
            delspayment = JSON.parse(JSON.stringify(spay));

            swal({
                title: "Are you sure to delete following Payment...?",
                text: "\n Bill No : " + delspayment.billno,
                icon: "warning", buttons: true, dangerMode: true,
            }).then((willDelete)=> {
                if (willDelete) {
                    var responce = httpRequest("/spayment","DELETE",delspayment);
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
                }loadForm();
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
            formattab = tblSupPayment.outerHTML;

           newwindow.document.write("" +
                "<html>" +
                "<head><style type='text/css'>.google-visualization-table-th {text-align: left;} .modifybutton{display: none} .isort{display: none}</style>" +
                "<link rel='stylesheet' href='../resources/bootstrap/css/bootstrap.min.css'/></head>" +
                "<body><div style='margin-top: 150px; '> <h1>Supplier Payment Details : </h1></div>" +
                "<div>"+ formattab+"</div>"+
               "</body>" +
                "</html>");
           setTimeout(function () {newwindow.print(); newwindow.close();},100) ;
        }

        function sortTable(cind) {
            cindex = cind;

         var cprop = tblCustomer.firstChild.firstChild.children[cindex].getAttribute('property');

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
            clearSelection(tblCustomer);
            loadForm();

            if(activerowno!="")selectRow(tblCustomer,activerowno,active);



        }