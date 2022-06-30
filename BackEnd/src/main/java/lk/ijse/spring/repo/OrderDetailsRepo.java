package lk.ijse.spring.repo;


import lk.ijse.spring.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderDetailsRepo extends JpaRepository<OrderDetail,Integer> {
}
