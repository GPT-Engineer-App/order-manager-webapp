import React, { useEffect, useState } from "react";
import { Container, VStack, Text, Select, Button, useToast, HStack, Box, Image, Input } from "@chakra-ui/react";

const Index = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [discount, setDiscount] = useState(0);
  const toast = useToast();

  useEffect(() => {
    // Fetch products and customers from the server
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://example.com/api/products");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Ürünler alınırken hata oluştu:", error);
      }
    };

    const fetchCustomers = async () => {
      try {
        const response = await fetch("https://example.com/api/customers");
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error("Müşteriler alınırken hata oluştu:", error);
      }
    };

    fetchProducts();
    fetchCustomers();
  }, []);

  const handleAddProduct = (product) => {
    setSelectedProducts((prevProducts) => {
      const existingProduct = prevProducts.find((p) => p.id === product.id);
      if (existingProduct) {
        return prevProducts.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      } else {
        return [...prevProducts, { ...product, quantity: 1 }];
      }
    });
  };

  const handleRemoveProduct = (productId) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
  };

  const handleQuantityChange = (productId, quantity) => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === productId ? { ...product, quantity: quantity } : product
      )
    );
  };

  const handleApplyDiscount = () => {
    setSelectedProducts((prevProducts) =>
      prevProducts.map((product) => ({
        ...product,
        discountedPrice: product.price - (product.price * discount) / 100,
      }))
    );
  };

  const handleCreateOrder = async () => {
    if (!selectedCustomer) {
      toast({
        title: "Hata",
        description: "Lütfen bir müşteri seçin.",
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
          customer: selectedCustomer,
          products: selectedProducts,
          discount: discount,
        }),
      });

      if (response.ok) {
        toast({
          title: "Sipariş Oluşturuldu",
          description: "Siparişiniz başarıyla oluşturuldu.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error("Sipariş oluşturulamadı");
      }
    } catch (error) {
      console.error("Sipariş oluşturulurken hata oluştu:", error);
      toast({
        title: "Hata",
        description: "Sipariş oluşturulurken bir hata oluştu.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const totalQuantity = selectedProducts.reduce((total, product) => total + product.quantity, 0);
  const totalAmount = selectedProducts.reduce((total, product) => total + (product.discountedPrice || product.price) * product.quantity, 0);

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl">Sipariş Oluştur</Text>
        <Select placeholder="Müşteri Seç" onChange={(e) => setSelectedCustomer(e.target.value)}>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </Select>
        {selectedCustomer && (
          <Box>
            <Text>Cari Hesap Kodu: {selectedCustomer.accountCode}</Text>
            <Text>Türü: {selectedCustomer.type}</Text>
            <Text>Adı: {selectedCustomer.name}</Text>
          </Box>
        )}
        <Box>
          <Text fontSize="xl">Seçilen Ürünler</Text>
          {selectedProducts.map((product) => (
            <HStack key={product.id} spacing={4}>
              <Text>{product.name}</Text>
              <Input
                type="number"
                value={product.quantity}
                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                width="60px"
              />
              <Button colorScheme="red" onClick={() => handleRemoveProduct(product.id)}>
                Kaldır
              </Button>
            </HStack>
          ))}
          <Text>Toplam Miktar: {totalQuantity}</Text>
          <Text>Toplam Tutar: {totalAmount.toFixed(2)} TL</Text>
        </Box>
        <Box>
          <Text fontSize="xl">İskonto Uygula</Text>
          <Input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(parseInt(e.target.value))}
            width="60px"
          />
          <Button colorScheme="blue" onClick={handleApplyDiscount}>
            Uygula
          </Button>
        </Box>
        <Button colorScheme="green" onClick={handleCreateOrder}>
          Siparişi Tamamla ve Gönder
        </Button>
        <Box>
          <Text fontSize="xl">Ürünler</Text>
          {products.map((product) => (
            <HStack key={product.id} spacing={4}>
              <Image src={product.image} boxSize="50px" />
              <Text>{product.name}</Text>
              <Text>{product.price} TL</Text>
              <Text>{product.unit}</Text>
              <Text>Kalan Stok: {product.stock}</Text>
              <Text>Kategori: {product.category}</Text>
              <Button colorScheme="blue" onClick={() => handleAddProduct(product)}>
                Ekle
              </Button>
            </HStack>
          ))}
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;