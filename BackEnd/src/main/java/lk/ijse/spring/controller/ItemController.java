package lk.ijse.spring.controller;


import lk.ijse.spring.dto.ItemDTO;
import lk.ijse.spring.service.ItemService;
import lk.ijse.spring.util.ResponseUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("item")
@CrossOrigin
public class ItemController {

    @Autowired
    ItemService itemService;

    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil saveItem(@ModelAttribute ItemDTO dto){
        itemService.saveItem(dto);
        return new ResponseUtil(200,"Item Successfully Added",null);

    }

    @GetMapping(path ="/{id}",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil getItem(@PathVariable String id){
        ItemDTO dto=itemService.getItem(id);
        return new ResponseUtil(200,"OK",dto);

    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil getAllItems(){
        List<ItemDTO> allItems=itemService.getAllItems();
        return new ResponseUtil(200,"OK",allItems);

    }

    @PutMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil updateItem(@RequestBody ItemDTO dto){
        itemService.updateItem(dto);
        return new ResponseUtil(200,"Item Updated Successfully.",null);

    }

    @DeleteMapping(path = "/{id}",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseUtil deleteCustomer(@PathVariable String id){
        itemService.deleteItem(id);
        return new ResponseUtil(200,"Item Deleted Successfully. ",null);

    }


}
