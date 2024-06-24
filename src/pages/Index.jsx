import React, { useEffect, useState } from "react";
import { Container, VStack, Text, Select, Button, useToast } from "@chakra-ui/react";

const Index = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const toast = useToast();

  useEffect(() => {
    // Fetch products and customers from the server
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://example.com/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchCustomers = async () => {
      try {
        const response = await fetch("https://example.com/api/customers");
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchProducts();
    fetchCustomers();
  }, []);

  const handleCreateOrder = async () => {
    if (!selectedProduct || !selectedCustomer) {
      toast({
        title: "Error",
        description: "Please select both a product and a customer.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const response = await fetch("https://example.com/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: selectedProduct,
          customer: selectedCustomer,
        }),
      });

      if (response.ok) {
        toast({
          title: "Order Created",
          description: "Your order has been created successfully.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error("Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Error",
        description: "There was an error creating your order.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Create an Order</Text>
        <Select placeholder="Select Product" onChange={(e) => setSelectedProduct(e.target.value)}>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </Select>
        <Select placeholder="Select Customer" onChange={(e) => setSelectedCustomer(e.target.value)}>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </Select>
        <Button colorScheme="blue" onClick={handleCreateOrder}>
          Create Order
        </Button>
      </VStack>
    </Container>
  );
};

export default Index;