package lk.ijse.spring.util;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class ResponseUtil {
    int code;
    String message;
    Object data;
}
