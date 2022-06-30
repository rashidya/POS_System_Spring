package lk.ijse.spring.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class OrderDetail {
    @Id
    @GeneratedValue
    private int orderDetailId;
    private int qty;
    @ManyToOne
    private Orders order;
    @ManyToOne
    private Item item;

    public OrderDetail(int qty, Orders order, Item item) {
        this.qty = qty;
        this.order = order;
        this.item = item;
    }
}
