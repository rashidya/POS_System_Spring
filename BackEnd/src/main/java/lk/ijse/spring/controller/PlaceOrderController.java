package lk.ijse.spring.controller;

import lk.ijse.spring.dto.OrderDTO;
import lk.ijse.spring.service.PlaceOrderService;
import lk.ijse.spring.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("order")
@CrossOrigin
public class PlaceOrderController {

    @Autowired
    PlaceOrderService placeOrderService;


    @GetMapping("/itemIds")
    public ResponseUtil getAllItemIds(){
        return new ResponseUtil(200,"OK",placeOrderService.getAllItemIds());
    }

    @GetMapping("/customerIds")
    public ResponseUtil getAllCustomerIds(){
        return new ResponseUtil(200,"OK",placeOrderService.getAllCustomerIds());
    }

    @GetMapping(path = "/{id}")
    public ResponseUtil getCustomer(@PathVariable String id){
        return new ResponseUtil(200,"OK",placeOrderService.getCustomer(id));
    }

    @GetMapping(params = {"code"})
    public ResponseUtil getItem(@RequestParam String code){
        return new ResponseUtil(200,"OK",placeOrderService.getItem(code));
    }

    @PostMapping
    public ResponseUtil saveOrder(@RequestBody OrderDTO order){
        placeOrderService.saveOrder(order);
        return new ResponseUtil(200,"Order Placed Successfully",null);
    }

}
