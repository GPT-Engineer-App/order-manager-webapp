import React, { useEffect, useState } from "react";
import { Container, VStack, Text, Select, Button, useToast, HStack, Box, Image, Input, Heading, Flex, Spacer } from "@chakra-ui/react";
import { motion } from "framer-motion";

const Index = () => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const toast = useToast();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

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
    try {
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
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: "An error occurred while adding the product.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
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
        originalPrice: product.price,
        discountedPrice: product.price - (product.price * discount) / 100,
      }))
    );
    const totalDiscountAmount = selectedProducts.reduce((total, product) => total + (product.price * discount) / 100 * product.quantity, 0);
    setDiscountAmount(totalDiscountAmount);
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
    <Container centerContent maxW="container.lg" w="100%" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center" p={8} bgGradient="linear(to-r, teal.500, green.500)">
      <VStack spacing={{ base: 4, md: 6 }} w="100%" maxW={{ base: "100%", md: "80%" }}>
        <Heading as="h1" size="2xl" mb={8} fontFamily="heading" bgGradient="linear(to-r, teal.700, green.500)" bgClip="text" fontSize={{ base: "3xl", md: "4xl" }} p={{ base: 2, md: 4 }} textAlign="center" w="100%">
          Sipariş Oluştur
        </Heading>
        <Box w="100%" p={{ base: 6, md: 8 }} bg="gray.100" boxShadow="xl" borderRadius="lg" mb={6}>
          <Text fontSize="xl" fontFamily="body" color="teal.800">Müşteri Seç</Text>
          <Select placeholder="Müşteri Seç" onChange={(e) => setSelectedCustomer(e.target.value)}>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </Select>
          {selectedCustomer && (
            <Box mt={4}>
              <Text fontSize="xl" fontFamily="body" color="teal.800">Cari Hesap Kodu: {customers.find(c => c.id === parseInt(selectedCustomer)).accountCode}</Text>
              <Text fontSize="xl" fontFamily="body" color="teal.800">Türü: {customers.find(c => c.id === parseInt(selectedCustomer)).type}</Text>
              <Text fontSize="xl" fontFamily="body" color="teal.800">Adı: {customers.find(c => c.id === parseInt(selectedCustomer)).name}</Text>
            </Box>
          )}
        </Box>
        <Box w="100%" p={{ base: 6, md: 8 }} bg="gray.100" boxShadow="xl" borderRadius="lg" mb={6}>
          <Text fontSize="xl" fontFamily="body" color="teal.800">Seçilen Ürünler</Text>
          {selectedProducts.map((product) => (
            <HStack key={product.id} spacing={{ base: 2, md: 4 }} mb={2} flexWrap="wrap" _hover={{ transform: "scale(1.05)" }} transition="transform 0.2s ease-in-out">
              <Text fontSize="xl" fontFamily="body" color="teal.800">{product.name}</Text>
              <Input
                type="number"
                value={product.quantity}
                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                width={{ base: "60px", md: "80px" }}
              />
              <Button colorScheme="red" onClick={() => handleRemoveProduct(product.id)} size={{ base: "sm", md: "md" }}>
                Kaldır
              </Button>
              <Text fontSize="xl" fontFamily="body" color="teal.800">
                <span style={{ textDecoration: 'line-through' }}>{product.originalPrice} TL</span> {product.discountedPrice.toFixed(2)} TL
              </Text>
            </HStack>
          ))}
          <Text fontSize="xl" fontFamily="body" color="teal.800">Toplam İskonto: {discountAmount.toFixed(2)} TL ({discount}%)</Text>
          <Text fontSize="xl" fontFamily="body" color="teal.800">Toplam Tutar: {totalAmount.toFixed(2)} TL</Text>
        </Box>
        <Box w="100%" p={{ base: 6, md: 8 }} bg="gray.100" boxShadow="xl" borderRadius="lg" mb={6}>
          <Text fontSize="xl" fontFamily="body" color="teal.800">İskonto Uygula</Text>
          <HStack spacing={4}>
            <Input type="number" value={discount} onChange={(e) => setDiscount(parseInt(e.target.value))} width={{ base: "50px", md: "60px" }} />
            <Button colorScheme="blue" onClick={handleApplyDiscount} size={{ base: "sm", md: "md" }} _hover={{ transform: "scale(1.1)", bg: "teal.700" }} transition="transform 0.2s ease-in-out">
              Uygula
            </Button>
          </HStack>
        </Box>
        <Button colorScheme="green" bg="teal.800" onClick={handleCreateOrder} mb={4} size={{ base: "sm", md: "lg" }} _hover={{ transform: "scale(1.1)", bg: "teal.900" }} transition="transform 0.2s ease-in-out" p={{ base: 4, md: 6 }}>
          Siparişi Tamamla ve Gönder
        </Button>
        <Box w="100%" p={{ base: 6, md: 8 }} bg="gray.100" boxShadow="xl" borderRadius="lg">
          <Text fontSize="xl" fontFamily="body" color="teal.800">Ürünler</Text>
          {products.map((product) => (
            <HStack key={product.id} spacing={{ base: 2, md: 4 }} mb={2} flexWrap="wrap" _hover={{ transform: "scale(1.05)" }} transition="transform 0.2s ease-in-out">
              <Image src={product.image} boxSize={{ base: "40px", md: "50px" }} />
              <Text fontSize="xl" fontFamily="body" color="teal.800">{product.name}</Text>
              <Text fontSize="xl" fontFamily="body" color="teal.800">{product.price} TL</Text>
              <Text fontSize="xl" fontFamily="body" color="teal.800">{product.unit}</Text>
              <Text fontSize="xl" fontFamily="body" color="teal.800">Kalan Stok: {product.stock}</Text>
              <Text fontSize="xl" fontFamily="body" color="teal.800">Kategori: {product.category}</Text>
              <Button colorScheme="blue" onClick={() => handleAddProduct(product)} size={{ base: "sm", md: "md" }} _hover={{ transform: "scale(1.1)", bg: "teal.700" }} transition="transform 0.2s ease-in-out">
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