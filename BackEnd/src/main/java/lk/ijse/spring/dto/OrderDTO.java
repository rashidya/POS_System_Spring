package lk.ijse.spring.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class OrderDTO {
    String orderId;
    String cusId;
    String date;
    double total;
    List<OrderItemDTO> orderItems;
}
