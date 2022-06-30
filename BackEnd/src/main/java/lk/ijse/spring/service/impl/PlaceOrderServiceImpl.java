package lk.ijse.spring.service.impl;

import lk.ijse.spring.dto.CustomerDTO;
import lk.ijse.spring.dto.ItemDTO;
import lk.ijse.spring.dto.OrderDTO;
import lk.ijse.spring.dto.OrderItemDTO;
import lk.ijse.spring.entity.Customer;
import lk.ijse.spring.entity.Item;
import lk.ijse.spring.entity.OrderDetail;
import lk.ijse.spring.entity.Orders;
import lk.ijse.spring.repo.CustomerRepo;
import lk.ijse.spring.repo.ItemRepo;
import lk.ijse.spring.repo.OrderDetailsRepo;
import lk.ijse.spring.repo.OrdersRepo;
import lk.ijse.spring.service.PlaceOrderService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class PlaceOrderServiceImpl implements PlaceOrderService {

    @Autowired
    OrdersRepo orderRepo;

    @Autowired
    ItemRepo itemRepo;
    @Autowired
    CustomerRepo customerRepo;
    @Autowired
    OrderDetailsRepo  orderDetailsRepo;
    @Autowired
    ModelMapper mapper;
    @Override
    public List<String> getAllItemIds() {
        List<Item> allItems = itemRepo.findAll();
        List<String> itemIdList=new ArrayList<>();
        for (Item item : allItems) {
            itemIdList.add(item.getItemCode());
        }
        return itemIdList;
    }

    @Override
    public List<String> getAllCustomerIds() {
        List<Customer> allItems = customerRepo.findAll();
        List<String> customerIdList=new ArrayList<>();
        for (Customer cus : allItems) {
            customerIdList.add(cus.getId());
        }
        return customerIdList;
    }

    @Override
    public CustomerDTO getCustomer(String id) {
        return mapper.map(customerRepo.findById(id).get(),CustomerDTO.class);
    }

    @Override
    public ItemDTO getItem(String id) {
        return mapper.map(itemRepo.findById(id).get(),ItemDTO.class);
    }

    @Override
    public void saveOrder(OrderDTO dto) {


        List<OrderDetail> orderDetailList=new ArrayList<>();
        Customer customer=customerRepo.findById(dto.getCusId()).get();


         Orders order=new Orders(dto.getOrderId(),dto.getDate(),dto.getTotal(),customer);

        for (OrderItemDTO orderItem : dto.getOrderItems()) {
            orderDetailList.add(new OrderDetail(orderItem.getOrderQty(),order,itemRepo.findById(orderItem.getItemCode()).get()));
        }

        if (!orderRepo.existsById(dto.getOrderId())){

            orderRepo.save(order);
            if (dto.getOrderItems().size() < 1) throw new RuntimeException("No items found.Please add items");

            for (OrderDetail orderItem : orderDetailList) {
                orderDetailsRepo.save(orderItem);
                Item item = itemRepo.findById(orderItem.getItem().getItemCode()).get();
                item.setQty(item.getQty() - orderItem.getQty());
                itemRepo.save(item);
            }
            order.setItemList(orderDetailList);
            orderRepo.save(order);
        }else{
            throw new RuntimeException(dto.getOrderId() +" - Order Id already Exists.");
        }
    }

}
