package lk.ijse.spring.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Orders {
    @Id
    private String orderId;
    private String date;
    private double total;

    @ManyToOne
    private Customer customer;

    @OneToMany(mappedBy = "order",cascade = CascadeType.ALL)
    private List<OrderDetail> itemList = new ArrayList();


    public Orders(String orderId, String date, double total, Customer customer) {
        this.orderId = orderId;
        this.date = date;
        this.total = total;
        this.customer = customer;
    }
}
