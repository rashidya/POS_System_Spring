package lk.ijse.spring.service;

import lk.ijse.spring.dto.ItemDTO;

import java.util.List;

public interface ItemService {
    List<ItemDTO> getAllItems();

    void saveItem(ItemDTO dto);

    ItemDTO getItem(String id);

    void updateItem(ItemDTO dto);

    void deleteItem(String id);
}
