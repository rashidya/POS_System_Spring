/*generateOrderId();*/
loadAllItemIds();

var cartItems=new Array();
var selectedCustomer;

$("#cartTbl").css('overflow');
var regDecimal = /^([0-9.]{1,})$/;
var regExOrderId = /^(OD-)[0-9]{3}$/;
var regExCusQty = /^([0-9]{1,})$/;


$("#cusQtyPlaceOrder").keyup(function (e) {
    let cusQty = parseInt($("#cusQtyPlaceOrder").val());
    let qty = parseInt($("#qtyPlaceOrder").val());
    if (regExCusQty.test($("#cusQtyPlaceOrder").val())) {
        $("#errorCustomerQty").text("");
        if (cusQty <= qty) {
            $("#cusQtyPlaceOrder").css('border-color', 'Green');
            $("#errorOverCustomerQty").text("");
            if (e.key == "Enter") {
                addItemToCart();
            }
        } else {
            $("#errorOverCustomerQty").text(`! Please enter an amount lover than ${qty}`);
            $("#cusQtyPlaceOrder").css('border-color', 'Red');
        }

    } else {
        $("#cusQtyPlaceOrder").css('border-color', 'Red');
        $("#errorCustomerQty").text("! Please enter an amount");
    }

});

$("#cashPlaceOrder").keyup(function (e) {
    setBalance();
    enableDisablePlaceOrderBtn();

});

$("#orderIdPlaceOrder").keyup(function (e) {
    validateOrderId();
    enableDisablePlaceOrderBtn();
});

$("#discountPlaceOrder").keyup(function (e) {
    let discount = parseFloat($("#discountPlaceOrder").val());

    if (regDecimal.test($("#discountPlaceOrder").val()) && discount <= 100) {
        $("#discountPlaceOrder").css('border-color', 'silver');
        $("#errorDiscount").css('display', 'none');
        setNetTotal();
        setBalance();
        enableDisablePlaceOrderBtn();
        if (e.key == "Enter") {

        }

    } else {
        $("#discountPlaceOrder").css('border-color', 'Red');
        $("#errorDiscount").css('display', 'block');
    }


});

$("#searchOrder").click(function (){
    cartItems=[];
    findOrder();

});


$("#selectCustomer").on('change', function () {
    let selectedId = $(this).find('option:selected').html();

    $.ajax({
        url: "http://localhost:8080/BackEnd_war/order/"+ selectedId,
        method: "GET",
        success: function (resp) {
            selectedCustomer = resp.data;
            $("#cusIdPlaceOrder").val(selectedCustomer.id);
            $("#cusNamePlaceOrder").val(selectedCustomer.name);
            $("#cusAddressPlaceOrder").val(selectedCustomer.address);
            $("#cusTelPlaceOrder").val(selectedCustomer.contactNo);

        },
        error: function (ob) {
            alert(ob.responseJSON.message);
        }
    });


});

$("#selectItem").on('change', function () {
    let selectedId = $(this).find('option:selected').html();
    $.ajax({
        url: "http://localhost:8080/BackEnd_war/order?code="+selectedId,
        method: "GET",
        success: function (resp) {
            let item = resp.data;
             $("#itemIdPlaceOrder").val(item.itemCode);
             $("#itemNamePlaceOrder").val(item.item);
            $("#pricePlaceOrder").val(item.unitPrice);
             $("#qtyPlaceOrder").val(item.qty);

        },
        error: function (ob) {
            alert(ob.responseJSON.message);
        }
    });
});



function placeOrder() {

    var itemList=new Array();
    var oId = $("#orderIdPlaceOrder").val();

    for (let i = 0; i < cartItems.length; i++) {
        itemList[i]={
            orderId:oId,
            itemCode:cartItems[i].itemId,
            orderQty:cartItems[i].itemQty
        }
    }


        var order = {
            orderId:oId,
            cusId:selectedCustomer,
            date:$("#orderDatePlaceOrder").val(),
            total:$("#netTotalPlaceOrder").text(),
            orderItems:itemList
        }


        $.ajax({
            url: "http://localhost:8080/BackEnd_war/order",
            method: "POST",
            contentType:"application/json",
            data: JSON.stringify(order),
            success: function (res) {
                console.log(res);
                if (res.code == 200) {
                    alert(res.message);

                    loadAllItems();
                    clearAll();
                } else {
                    alert(res.message);
                }

            },
            error: function (ob, textStatus, error) {
                console.log(ob);
                console.log(textStatus);
                console.log(error);
                console.log()
            }
        });


}

function findOrder(){
    let orderId = $("#orderSearchID").val();

    $.ajax({
        url: "http://localhost:8080/BackEnd_war/order?option=SearchOrder&id="+ orderId,
        method: "GET",
        success: function (resp) {
            $("#orderDatePlaceOrder").val(resp.orderDate);
            $("#netTotalPlaceOrder").text(resp.total);
            $("#grossTotalPlaceOrder").text(resp.total);
            $("#selectCustomer").val(resp.cusId);
            $("#selectCustomer").trigger("change");


            let i=0;

            for (let orderItem of resp.orderItems) {

                $.ajax({
                    url: "http://localhost:8080/BackEnd_war/order?option=Item&id="+ orderItem.itemCode,
                    method: "GET",
                    success: function (response) {
                        i++;
                        let total=parseFloat(response.price)*parseInt(orderItem.cusQty);
                        cartItems.push(new CartItem(orderItem.itemCode,response.itemName,response.price,orderItem.cusQty,total))
                        console.log(cartItems)
                        if (resp.orderItems.length==i){
                            loadCartTable();
                        }
                    },
                    error: function (ob, statusText, error) {

                    }
                });

            }




        },
        error: function (ob, statusText, error) {
            alert("There is no Order with this Id");
        }
    });


}

function validateAllPlaceOrder(){
    let today = new Date().getDate();

    if (validateOrderId()) {
        if ($("#cusIdPlaceOrder").val()!==''){
            if (cartItems.length!==0){
                if (validateCash()) {
                    return true;
                } else {
                    return false;
                }
            }else {
                return false;
            }
        }else{
            return false;
        }
    } else {
        return false;
    }
}

function enableDisablePlaceOrderBtn() {
    if (validateAllPlaceOrder()){
        $("#btnPlaceOrder").attr('disabled', false);
    }else {
        $("#btnPlaceOrder").attr('disabled', true);
    }
}

function validateOrderId(){
    if (regExOrderId.test($("#orderIdPlaceOrder").val())){
        $("#orderIdPlaceOrder").css('border-color', 'Green');
        $("#errorOrderId").css('display', 'none');
        return true;
        /*if (isOrderIdExist()){
            return false;
        }else {
            return true;
        }*/

    }else {
        $("#orderIdPlaceOrder").css('border-color', 'Red');
        $("#errorOrderId").css('display', 'block');
        return false;
    }
}

function validateCash(){
    let cash = parseFloat($("#cashPlaceOrder").val());
    let netTotal = parseFloat($("#netTotalPlaceOrder").text());
    if (regDecimal.test($("#cashPlaceOrder").val()) && netTotal <= cash){
        setBalance();
        $("#cashPlaceOrder").css('border-color', 'Silver');
        return true;
    }else {
        $("#cashPlaceOrder").css('border-color', 'Red');
        $("#balancePlaceOrder").val("");
        return false;
    }
}

/*
function isOrderIdExist(){
    orders.find(function (e){
        if (e.getId()===$("#orderIdPlaceOrder").val() ){
            return true;
        }
    });
    return false;
}*/

/*
function generateOrderId() {
    var tempId;
    if (orders.length !== 0) {

        var id = orders[orders.length - 1].getId();
        var temp = id.split("-")[1];
        temp++;
        tempId = (temp < 10) ? "OD-00" + temp : (temp < 100) ? "OD-0" + temp : "OD-" + temp;

    } else {
        tempId = "OD-001";
    }

    $("#orderIdPlaceOrder").val(tempId);
}*/


function loadAllItemIds() {


    $.ajax({
        url: "http://localhost:8080/BackEnd_war/order/itemIds",
        method: "GET",
        success: function (resp) {

            var allIds = resp.data;
            $("#selectItem>option").remove();

            for (let id of allIds) {

                let option = `<option value="${id}">${id}</option>`;
                $("#selectItem").append(option);
            }

        },
        error: function (ob, statusText, error) {
            alert(statusText);
        }
    });

}

function loadAllCustomerIds() {
    $.ajax({
        url: "http://localhost:8080/BackEnd_war/order/customerIds",
        method: "GET",
        success: function (resp) {

            var allIds = resp.data;
            $("#selectCustomer>option").remove();


            for (let id of allIds) {
                let option = `<option value="${id}">${id}</option>`;
                $("#selectCustomer").append(option);

            }

        },
        error: function (ob, statusText, error) {
            alert(statusText);
        }
    });



}



function addItemToCart() {

    let orderId = $("#orderIdPlaceOrder").val();
    let itemCode = $("#itemIdPlaceOrder").val();
    let itemName = $("#itemNamePlaceOrder").val();
    let price = $("#pricePlaceOrder").val();
    let cusQty = $("#cusQtyPlaceOrder").val();
    let total = (cusQty) * (price);

    for (let i = 0; i < cartItems.length; i++) {
        if (cartItems[i].getId() === itemCode) {
            let newQty
            if (!isNaN(itemCode) && ("#addCart").text() === "Add") {
                newQty = parseInt(cartItems[i].getCusQty()) + parseInt(cusQty);
            } else {
                newQty = cusQty;
            }

            cartItems[i].setQty(newQty);
            cartItems[i].setTotal(newQty * price);
            loadCartTable();
            clearItemFields();
            setGrossTotal();
            return;

        }

    }


    cartItems.push(new CartItem(itemCode,itemName,price,cusQty,total));


    loadCartTable();
    clearItemFields();
    setGrossTotal();

}

/*function setDate() {
    $('#orderDatePlaceOrder').datepicker().datepicker('setDate', 'today');
}*/

function setGrossTotal() {
    let grossTotal = 0;
    for (let cartItem of cartItems) {
        grossTotal = parseFloat(grossTotal) + parseFloat(cartItem.getTotal());
    }
    $("#grossTotalPlaceOrder").text(grossTotal);
    setNetTotal();
}

function setNetTotal() {
    let discount = parseFloat($("#discountPlaceOrder").val());
    let grossTotal = parseFloat($("#grossTotalPlaceOrder").text());
    let netTotal = grossTotal;
    if (!isNaN(discount)) {
        netTotal = grossTotal - ((grossTotal * discount) / 100.0);
    }

    $("#netTotalPlaceOrder").text(netTotal);
}

function setBalance() {
    let cash = parseFloat($("#cashPlaceOrder").val());
    let netTotal = parseFloat($("#netTotalPlaceOrder").text());

    if (!isNaN(cash)) {
        let balance = cash - netTotal;
        $("#balancePlaceOrder").text(balance);
    }

}

function loadCartTable() {

    $("#cartTbl>tr").remove();
    for (let cartItem of cartItems) {
        let total = parseFloat(cartItem.getTotal());
        let row = `<tr><td>${cartItem.getId()}</td><td>${cartItem.getName()}</td><td>${cartItem.getPrice()}</td><td>${cartItem.getQty()}</td><td>${total}</td></tr>`;
        $("#cartTbl").append(row);
    }


    $("#cartTbl>tr").off('click');

    $("#cartTbl>tr").click(function () {
        let id = $(this).children(':first-child').html();
        let itemName = $(this).children(':nth-child(2)').html();
        let price = $(this).children(':nth-child(3)').html();
        let qty = $(this).children(':nth-child(4)').html();

        $("#itemIdPlaceOrder").val(id);
        $("#itemNamePlaceOrder").val(itemName);
        $("#pricePlaceOrder").val(price);
        $("#cusQtyPlaceOrder").val(qty);

        items.find(function (e) {
            if (e.getId() === id) {
                $("#qtyPlaceOrder").val(e.getQty());
            }
        });

        $("#addCart").text("Update");
    });
}

function clearItemFields() {
    $("#itemIdPlaceOrder").val("");
    $("#itemNamePlaceOrder").val("");
    $("#pricePlaceOrder").val("");
    $("#cusQtyPlaceOrder").val("");
    $("#qtyPlaceOrder").val("");
    $("#cusQtyPlaceOrder").css('border-color', 'Silver');
    $("#addCart").text("Add");
}

function clearInvoiceFields() {
    $("#orderIdPlaceOrder").val("");
    // $("#orderDatePlaceOrder").val("");
    $("#cusIdPlaceOrder").val("");
    $("#cusNamePlaceOrder").val("");
    $("#cusAddressPlaceOrder").val("");
    $("#cusTelPlaceOrder").val("");
}

function clearBillDetails() {
    $("#grossTotalPlaceOrder").text("0.00");
    $("#netTotalPlaceOrder").text("0.00");
    $("#discountPlaceOrder").val("");
    $("#cashPlaceOrder").val("");
    $("#balancePlaceOrder").text("0.00");
    $("#discountPlaceOrder").css('border-color', 'Silver');
    $("#cashPlaceOrder").css('border-color', 'Silver');
}

function clearAll() {
    clearInvoiceFields();
    clearItemFields();
    clearBillDetails();
    $("#cartTbl>tr").remove();
    cartItems = [];
  /*  generateOrderId();*/
}


$("#addCart").click(function () {
    addItemToCart();
});

$("#btnPlaceOrder").click(function () {
    placeOrder();


});

$("#btnCancelPlaceOrder").click(function () {
    clearAll();
});



function CartItem(id, name, price, qty, total) {
    this.itemId = id;
    this.itemName = name;
    this.itemPrice = price;
    this.itemQty = qty;
    this.total = total;

    this.getId = function () {
        return this.itemId;
    }
    this.setId = function (_id) {
        this.itemId = _id;
    }

    this.getName = function () {
        return this.itemName;
    }

    this.setName = function (_name) {
        this.itemName = _name;
    }
    this.getPrice = function () {
        return this.itemPrice;
    }

    this.setPrice = function (_price) {
        this.itemPrice = _price;
    }
    this.getQty = function () {
        return this.itemQty;
    }

    this.setQty= function (_qty) {
        this.itemQty = _qty;
    }

    this.getTotal = function () {
        return this.total;
    }

    this.setTotal= function (_total) {
        this.total = _total;
    }

}
