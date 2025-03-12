import React, { useState } from "react";
import axios from "axios";


const Login: React.FC = () => {
    const [postResponse, setPostResponse] = useState<string>("");


    const handleLogout = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Bạn chưa đăng nhập!");
            return;
        }
      
        axios.post("http://localhost:8080/api/auth/logout", {}, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // ✅ Đảm bảo token được gửi đúng
              "Content-Type": "application/json",
            }
          })
          .then(response => console.log("🚀 Logout thành công:", response))
          .catch(error => console.error("❌ Lỗi khi logout:", error));
      };


    // Gửi request đăng nhập (POST)
    const handlePostRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:8080/api/auth/login",
                {
                    "username": "testuser",
                    "password": "password123"
                }, // Gửi dưới dạng JSON body
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true // Quan trọng: gửi token hoặc cookie nếu cần
                }
                
            );
            // ✅ Nếu đăng nhập thành công, lưu Token & Role vào localStorage
            const { token, roles } = response.data;
            localStorage.setItem("token", token);
            localStorage.setItem("roles", JSON.stringify(roles));
            console.log(localStorage.getItem("token"));

            console.log("Đăng nhập thành công:", response.data);
        } catch {
            setPostResponse("Lỗi khi gửi POST API");
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h2>API Tester</h2>



            {/* Test POST API (Login) */}
            <h3>Đăng Nhập</h3>
            
                <button  onClick={handlePostRequest} >Đăng nhập</button>
                <button  onClick={handleLogout} >Đăng xuất</button>

            <pre>{postResponse}</pre>

        </div>
    );
};

export default Login;
