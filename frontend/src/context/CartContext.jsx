import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [carrito, setCarrito] = useState(() => {
        try {
            const stored = localStorage.getItem("carrito");
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    // Persistir en localStorage
    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }, [carrito]);

    const agregarAlCarrito = (prod) => {
        setCarrito((prev) => {
            const existe = prev.find((p) => p._id === prod._id);
            return existe
                ? prev.map((p) =>
                    p._id === prod._id ? { ...p, qty: p.qty + 1 } : p
                )
                : [...prev, { ...prod, qty: 1 }];
        });
    };

    const eliminarDelCarrito = (id) => {
        setCarrito((prev) => prev.filter((p) => p._id !== id));
    };

    const actualizarCantidad = (id, qty) => {
        if (qty < 1) {
            eliminarDelCarrito(id);
            return;
        }
        setCarrito((prev) =>
            prev.map((p) => (p._id === id ? { ...p, qty } : p))
        );
    };

    const vaciarCarrito = () => {
        setCarrito([]);
    };

    const totalItems = carrito.reduce((acc, p) => acc + p.qty, 0);
    const totalPrecio = carrito.reduce(
        (acc, p) => acc + parseFloat(p.Precio) * p.qty,
        0
    );

    return (
        <CartContext.Provider
            value={{
                carrito,
                agregarAlCarrito,
                eliminarDelCarrito,
                actualizarCantidad,
                vaciarCarrito,
                totalItems,
                totalPrecio,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart debe usarse dentro de un CartProvider");
    }
    return context;
};
