/*/!*generateItemId();*!/*/
loadAllItems();

var regExItemId = /^(I-)[0-9]{3}$/;
var regExItemName = /^([A-z0-9/,\s]{3,})$/;
var regExPrice = /^([0-9.]{1,})$/;
var regExQty = /^([0-9]{1,})$/;



function validateItemId(event) {
    if (regExItemId.test($("#itemId").val())) {
        $("#itemId").css('border-color', 'Green');
        $("#errorItemId").css('display', 'none');
        if (event === "Enter") {
            $("#itemName").focus();
        }

    } else {
        $("#itemId").css('border-color', 'Red');
        $("#errorItemId").css('display', 'block');

    }
}

function validateItemName(event) {
    if (regExItemName.test($("#itemName").val())) {
        $("#itemName").css('border-color', 'Green');
        $("#errorItem").css('display', 'none');
        if (event == "Enter") {
            $("#price").focus();
        }

    } else {
        $("#itemName").css('border-color', 'Red');
        $("#errorItem").css('display', 'block');

    }
}

function validatePrice(event) {
    if (regExPrice.test($("#price").val())) {
        $("#price").css('border-color', 'Green');
        $("#errorPrice").css('display', 'none');
        if (event == "Enter") {
            $("#Qty").focus();
        }

    } else {
        $("#price").css('border-color', 'Red');
        $("#errorPrice").css('display', 'block');

    }

}

function validateQty(event) {
    if (regExQty.test($("#Qty").val())) {
        $("#Qty").css('border-color', 'Green');
        $("#errorQty").css('display', 'none');

        if ($('#AddItem').is(':enabled') && event == "Enter") {
            saveItem();
            $("#itemId").focus();
        }

    } else {
        $("#Qty").css('border-color', 'Red');
        $("#errorQty").css('display', 'block');

    }
}


function enableAddItem() {

    if (regExItemId.test($("#itemId").val()) && regExItemName.test($("#itemName").val()) && regExPrice.test($("#price").val()) && regExQty.test($("#Qty").val())) {
        $("#AddItem").attr('disabled', false);
    } else {
        $("#AddItem").attr('disabled', true);
    }

}


$("#itemId").keyup(function (e) {
    enableAddItem();
    validateItemId(e.key);

});

$("#itemName").keyup(function (e) {
    enableAddItem();
    validateItemName(e.key);
});

$("#price").keyup(function (e) {
    enableAddItem();
    validatePrice(e.key);

});

$("#Qty").keyup(function (e) {
    enableAddItem();
    validateQty(e.key);
});


function saveItem() {

    let saveItem = confirm("Do you want to save this item?");
    if (saveItem.valueOf()) {
        var data = $("#itemForm").serialize();
        console.log(data);
        $.ajax({
            url: "http://localhost:8080/BackEnd_war/item",
            method: "POST",
            data: data,
            success: function (res) {
                console.log(res);
                if (res.code == 200) {
                    alert(res.message);
                    loadAllItems();
                    clearItem();
                    /* generateItemId();
                     loadAllItemIds();*/
                }

            },
            error: function (ob) {
                alert(ob.responseJSON.message);
            }
        });


    }

}

function updateItem() {
    let updateItem = confirm("Do you want to update this item?");
    if (updateItem.valueOf()) {
        var item = {
            id: $("#itemId").val(),
            item: $("#itemName").val(),
            unitPrice: $("#price").val(),
            qty: $("#Qty").val()
        }

        $.ajax({
            url: "http://localhost:8080/BackEnd_war/item",
            method: "PUT",
            data: JSON.stringify(item),
            contentType: "application/json",
            success: function (res) {
                console.log(res);
                if (res.code == 200) {
                    alert(res.message);
                    loadAllItems();
                    clearItem();
                    /*   generateItemId();*/
                }

            },
            error: function (ob) {
                alert(ob.responseJSON.message);
            }
        });


    }
}

function findItem() {
    let itemId = $("#itemSearchID").val();
    console.log(itemId)
    $.ajax({
        url: "hhttp://localhost:8080/BackEnd_war/item/" + itemId,
        method: "GET",
        success: function (resp) {
            $("#itemId").val(resp.itemId);
            $("#itemName").val(resp.itemName);
            $("#price").val(resp.price);
            $("#Qty").val(resp.qty);

        },
        error: function (ob) {
            alert(ob.responseJSON.message);
        }
    });


}

function deleteItem() {
    let deleteItem = confirm("Do you want to delete this item?");
    if (deleteItem.valueOf()) {
        var itemId = $("#itemId").val();
        $.ajax({
            url: "http://localhost:8080/BackEnd_war/item/" + itemId,
            method: "DELETE",
            success: function (resp) {

                if (resp.code == 200) {

                    alert(resp.message);
                    loadAllItems();
                    clearItem();
                    /*generateItemId();*/
                    /* loadAllItemIds();*/
                }

            },
            error: function (ob, statusText, error) {
                alert(ob.responseJSON.message);
            }
        });

    }

}


/*function generateItemId() {
    var tempId;
    if (items.length != 0) {

        var id = items[items.length - 1].getId();
        var temp = id.split("-")[1];
        temp++;
        tempId = (temp < 10) ? "I-00" + temp : (temp < 100) ? "I-0" + temp : "I-" + temp;

    } else {
        tempId = "I-001";
    }
    $("#itemId").val(tempId);
}*/


function loadAllItems() {

    $.ajax({
        url: "http://localhost:8080/BackEnd_war/item",
        method: "GET",
        success: function (resp) {

            $("#itemTbl>tr").remove();

            for (let item of resp.data) {
                let row = `<tr><td>${item.itemCode}</td><td>${item.item}</td><td>${item.unitPrice}</td><td>${item.qty}</td></tr>`;
                $("#itemTbl").append(row);
            }

            $("#itemTbl>tr").off('click');
            $("#itemTbl>tr").off('dblclick');


            bindClickEventsItem();

        },
        error: function (ob, statusText, error) {
            alert(statusText);
        }
    });


}

function bindClickEventsItem() {
    $("#itemTbl>tr").click(function () {
        let id = $(this).children(':first-child').html();
        let itemName = $(this).children(':nth-child(2)').html();
        let price = $(this).children(':nth-child(3)').html();
        let qty = $(this).children(':nth-child(4)').html();

        $("#itemId").val(id);
        $("#itemName").val(itemName);
        $("#price").val(price);
        $("#Qty").val(qty);
    });

    $("#itemTbl>tr").dblclick(function () {
        deleteItem();
    });
}

function clearItem() {
    $("#itemId").val("");
    $("#itemId").css('border-color', 'Silver');
    $("#itemName").val("");
    $("#itemName").css('border-color', 'Silver');
    $("#price").val("");
    $("#price").css('border-color', 'Silver');
    $("#Qty").val("");
    $("#Qty").css('border-color', 'Silver');
    enableAddItem();
    /*generateItemId();*/
}


$("#AddItem").click(function () {
    saveItem();

});

$("#UpdateItem").click(function () {
    updateItem();
});

$("#DeleteItem").click(function () {
    deleteItem();
});

$("#searchItem").click(function () {
    findItem();

});

$("#cancelItem").click(function () {
    clearItem();

});




