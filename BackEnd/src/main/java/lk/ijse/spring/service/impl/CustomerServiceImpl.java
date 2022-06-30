package lk.ijse.spring.service.impl;

import lk.ijse.spring.dto.CustomerDTO;
import lk.ijse.spring.entity.Customer;
import lk.ijse.spring.repo.CustomerRepo;
import lk.ijse.spring.service.CustomerService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private CustomerRepo customerRepo;

    @Autowired
    private ModelMapper mapper;

    @Override
    public void saveCustomer(CustomerDTO dto) {
        if (!customerRepo.existsById(dto.getId())) {
            customerRepo.save(mapper.map(dto, Customer.class));
        }else {
            throw new RuntimeException("Customer Already Exists.Please check the Id.");
        }
    }

    @Override
    public CustomerDTO getCustomer(String id) {
        if (customerRepo.existsById(id)) {
            Customer customer = customerRepo.findById(id).get();
            return mapper.map(customer,CustomerDTO.class);
        }else {
            throw new RuntimeException("Customer does not Exist.Please check the Id.");
        }
    }

    @Override
    public List<CustomerDTO> getAllCustomers() {
        List<Customer> allCustomers = customerRepo.findAll();
        return mapper.map(allCustomers, new TypeToken<List<CustomerDTO>>(){}.getType());
    }

    @Override
    public void updateCustomer(CustomerDTO dto) {
        if (customerRepo.existsById(dto.getId())) {
            customerRepo.save(mapper.map(dto, Customer.class));
        }else {
            throw new RuntimeException("Customer does not Exist.Please check the Id.");
        }
    }

    @Override
    public void deleteCustomer(String id) {
        if (customerRepo.existsById(id)) {
            customerRepo.deleteById(id);
        }else {
            throw new RuntimeException("Customer does not Exist.Please check the Id.");
        }

    }
}
