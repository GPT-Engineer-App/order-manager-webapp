import React, { useEffect, useState } from "react";
import { Container, VStack, Text, Select, Button, useToast, HStack, Box, Image, Input, Heading, Flex, Spacer } from "@chakra-ui/react";

const Index = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [discount, setDiscount] = useState(0);
  const toast = useToast();

  useEffect(() => {
    // Demo data for products and customers
    const demoProducts = [
      { id: 1, name: "Product 1", price: 100, unit: "pcs", stock: 50, category: "Category A", image: "https://via.placeholder.com/50" },
      { id: 2, name: "Product 2", price: 200, unit: "pcs", stock: 30, category: "Category B", image: "https://via.placeholder.com/50" },
      { id: 3, name: "Product 3", price: 150, unit: "pcs", stock: 20, category: "Category C", image: "https://via.placeholder.com/50" },
    ];

    const demoCustomers = [
      { id: 1, name: "Customer 1", accountCode: "C001", type: "Retail" },
      { id: 2, name: "Customer 2", accountCode: "C002", type: "Wholesale" },
      { id: 3, name: "Customer 3", accountCode: "C003", type: "Retail" },
    ];

    setProducts(demoProducts);
    setCustomers(demoCustomers);
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
    <Container centerContent maxW="container.lg" w="100%" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" p={8} bg="white">
      <VStack spacing={{ base: 4, md: 6 }}>
        <Heading as="h1" size="2xl" mb={8} fontFamily="heading" color="brand.700">Sipariş Oluştur</Heading>
        <Box w="100%" p={{ base: 6, md: 8 }} bg="gray.100" boxShadow="lg" borderRadius="lg" mb={6}>
          <Text fontSize="2xl" fontFamily="body" color="brand.800">Müşteri Seç</Text>
          <Select placeholder="Müşteri Seç" onChange={(e) => setSelectedCustomer(e.target.value)}>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </Select>
          {selectedCustomer && (
            <Box mt={4}>
              <Text>Cari Hesap Kodu: {selectedCustomer.accountCode}</Text>
              <Text>Türü: {selectedCustomer.type}</Text>
              <Text>Adı: {selectedCustomer.name}</Text>
            </Box>
          )}
        </Box>
        <Box w="100%" p={{ base: 6, md: 8 }} bg="gray.100" boxShadow="lg" borderRadius="lg" mb={6}>
          <Text fontSize="xl">Seçilen Ürünler</Text>
          {selectedProducts.map((product) => (
            <HStack key={product.id} spacing={{ base: 2, md: 4 }} mb={2} flexWrap="wrap">
              <Text>{product.name}</Text>
              <Input
                type="number"
                value={product.quantity}
                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                width={{ base: "60px", md: "80px" }}
              />
              <Button colorScheme="red" onClick={() => handleRemoveProduct(product.id)} size={{ base: "sm", md: "md" }}>
                Kaldır
              </Button>
            </HStack>
          ))}
          <Text>Toplam Miktar: {totalQuantity}</Text>
          <Text>Toplam Tutar: {totalAmount.toFixed(2)} TL</Text>
        </Box>
        <Box w="100%" p={{ base: 6, md: 8 }} bg="gray.100" boxShadow="lg" borderRadius="lg" mb={6}>
          <Text fontSize="xl">İskonto Uygula</Text>
          <Input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(parseInt(e.target.value))}
            width={{ base: "50px", md: "60px" }}
          />
          <Button colorScheme="blue" onClick={handleApplyDiscount} mt={2} size={{ base: "sm", md: "md" }} _hover={{ transform: "scale(1.05)" }} transition="transform 0.2s ease-in-out">
            Uygula
          </Button>
        </Box>
        <Button colorScheme="green" onClick={handleCreateOrder} mb={4} size={{ base: "sm", md: "md" }} _hover={{ transform: "scale(1.05)" }} transition="transform 0.2s ease-in-out">
          Siparişi Tamamla ve Gönder
        </Button>
        <Box w="100%" p={{ base: 6, md: 8 }} bg="gray.100" boxShadow="lg" borderRadius="lg">
          <Text fontSize="xl">Ürünler</Text>
          {products.map((product) => (
            <HStack key={product.id} spacing={{ base: 2, md: 4 }} mb={2} flexWrap="wrap">
              <Image src={product.image} boxSize={{ base: "40px", md: "50px" }} />
              <Text>{product.name}</Text>
              <Text>{product.price} TL</Text>
              <Text>{product.unit}</Text>
              <Text>Kalan Stok: {product.stock}</Text>
              <Text>Kategori: {product.category}</Text>
              <Button colorScheme="blue" onClick={() => handleAddProduct(product)} size={{ base: "sm", md: "md" }} _hover={{ transform: "scale(1.05)" }} transition="transform 0.2s ease-in-out">
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