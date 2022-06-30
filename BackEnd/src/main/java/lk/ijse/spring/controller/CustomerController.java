package lk.ijse.spring.controller;


import lk.ijse.spring.dto.CustomerDTO;
import lk.ijse.spring.service.CustomerService;
import lk.ijse.spring.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("customer")
@CrossOrigin
public class CustomerController {

    @Autowired
    CustomerService customerService;

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil saveCustomer(@ModelAttribute CustomerDTO dto){
        customerService.saveCustomer(dto);
        return new ResponseUtil(200,"Customer Successfully Added",null);

    }

    @GetMapping(path ="/{id}",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil getCustomer(@PathVariable String id){
        CustomerDTO dto=customerService.getCustomer(id);
        return new ResponseUtil(200,"OK",dto);

    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil getAllCustomers(){
        List<CustomerDTO> allCustomers=customerService.getAllCustomers();
        return new ResponseUtil(200,"OK",allCustomers);

    }

    @PutMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil updateCustomer(@RequestBody CustomerDTO dto){
        customerService.updateCustomer(dto);
        return new ResponseUtil(200,"Customer Updated Successfully.",null);

    }

    @DeleteMapping(path = "/{id}",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil deleteCustomer(@PathVariable String id){
        customerService.deleteCustomer(id);
        return new ResponseUtil(200,"Customer Deleted Successfully. ",null);

    }


}
