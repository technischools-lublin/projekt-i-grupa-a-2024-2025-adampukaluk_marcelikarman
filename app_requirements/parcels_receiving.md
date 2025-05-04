### **Funkcjonalność: Odbieranie paczek**

#### **Opis:**

Funkcjonalność odbierania paczek umożliwia użytkownikowi dostęp do listy jego zamówień w panelu "Twoje zamówienia". Jeśli status paczki to **"w paczkomacie"**, użytkownik może wejść w szczegóły zamówienia, aby uzyskać informacje o paczce oraz otworzyć skrytkę paczkomatu wirtualnie. Użytkownik ma możliwość skorzystania z trzech opcji:

1. **Kod QR** – umożliwia otwarcie aplikacji paczkomatu i skierowanie użytkownika do odpowiedniej skrytki w fizycznym paczkomacie (w systemie "na niby").
    
2. **Przycisk "Otwórz zdalnie skrytkę"** – umożliwia otwarcie paczki zdalnie w systemie.
    
3. **Kod odbioru** – użytkownik wpisuje kod odbioru, który jest niezbędny do potwierdzenia odbioru paczki.
    

Po wykonaniu tych kroków, system (symulacyjnie) po 20 sekundach wyświetli komunikat: **"Paczka odebrana, dziękujemy za skorzystanie z naszej usługi."**

#### **Historyjka użytkownika (user story):**

**Jako** użytkownik paczkomatu,  
**Chcę** mieć możliwość odbioru paczki z panelu "Twoje zamówienia",  
**Aby** wprowadzić kod odbioru, zeskanować kod QR lub otworzyć paczkę zdalnie, a po 20 sekundach otrzymać potwierdzenie odbioru paczki.

#### **Acceptance Criteria (AC):**

1. Użytkownik widzi listę swoich zamówień w panelu "Twoje zamówienia".
    
2. Paczki, które mają status **"w paczkomacie"**, są dostępne do odbioru.
    
3. Użytkownik wchodzi do szczegółów zamówienia, aby zobaczyć:
    
    - **Kod QR** do otwarcia aplikacji paczkomatu.
        
    - **Przycisk "Otwórz zdalnie skrytkę"**.
        
    - **Kod odbioru**, który należy wpisać.
        
4. Użytkownik wprowadza kod odbioru lub używa jednej z innych opcji.
    
5. Po 20 sekundach (w systemie "na niby") system wyświetla komunikat: **"Paczka odebrana, dziękujemy za skorzystanie z naszej usługi."**
    
6. W fizycznym paczkomacie, po otwarciu skrytki, użytkownik mógłby otrzymać taki sam komunikat potwierdzający odbiór paczki.
