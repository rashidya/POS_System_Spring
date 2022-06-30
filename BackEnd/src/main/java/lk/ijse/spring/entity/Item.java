package lk.ijse.spring.entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@ToString
@Entity
public class Item {
    @Id
   private String itemCode;
   private String item;
   private double unitPrice;
   private int qty;

   @OneToMany(mappedBy = "item")
    private List<OrderDetail> orderDetailList;
}
