package lk.ijse.spring.service.impl;

import lk.ijse.spring.dto.ItemDTO;
import lk.ijse.spring.entity.Item;
import lk.ijse.spring.repo.ItemRepo;
import lk.ijse.spring.service.ItemService;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ItemServiceImpl implements ItemService {

    @Autowired
    private ItemRepo itemRepo;

    @Autowired
    private ModelMapper mapper;

    @Override
    public void saveItem(ItemDTO dto) {
        if (!itemRepo.existsById(dto.getItemCode())) {
            itemRepo.save(mapper.map(dto, Item.class));
        }else {
            throw new RuntimeException("Item Already Exists.Please check the Id.");
        }
    }

    @Override
    public ItemDTO getItem(String id) {
        if (itemRepo.existsById(id)) {
            Item item = itemRepo.findById(id).get();
            return mapper.map(item,ItemDTO.class);
        }else {
            throw new RuntimeException("Item does not Exist.Please check the Id.");
        }
    }

    @Override
    public List<ItemDTO> getAllItems() {
        List<Item> allItems = itemRepo.findAll();
        return mapper.map(allItems, new TypeToken<List<ItemDTO>>(){}.getType());
    }

    @Override
    public void updateItem(ItemDTO dto) {
        if (itemRepo.existsById(dto.getItemCode())) {
            itemRepo.save(mapper.map(dto, Item.class));
        }else {
            throw new RuntimeException("Item does not Exist.Please check the Id.");
        }
    }

    @Override
    public void deleteItem(String id) {
        if (itemRepo.existsById(id)) {
            itemRepo.deleteById(id);
        }else {
            throw new RuntimeException("Item does not Exist.Please check the Id.");
        }

    }
}
