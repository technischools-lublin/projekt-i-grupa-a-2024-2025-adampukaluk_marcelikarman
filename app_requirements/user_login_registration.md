### **Funkcjonalność: Logowanie i Rejestracja użytkownika**

#### **Opis:**

Funkcjonalność logowania i rejestracji pozwala użytkownikom na stworzenie konta lub zalogowanie się do systemu paczkomatu. Użytkownicy będą musieli podać adres e-mail i hasło, które będą używane do uwierzytelniania ich tożsamości. Proces rejestracji wymaga podania unikalnego adresu e-mail, który nie może być już zarejestrowany w systemie, oraz hasła, które musi spełniać określone wymagania (np. minimalna długość). Po udanej rejestracji użytkownik otrzymuje dostęp do swojego konta i może korzystać z paczkomatu. W przypadku logowania użytkownik wprowadza swój e-mail oraz hasło, a system autoryzuje go i pozwala na korzystanie z funkcji paczkomatu.

#### **Historyjka użytkownika (user story):**

**Jako** nowy użytkownik,  
**Chcę** zarejestrować konto za pomocą e-maila i hasła,  
**Aby** móc później się zalogować i korzystać z funkcji paczkomatu.

#### **Acceptance Criteria (AC):**

1. Użytkownik przechodzi do strony rejestracji.
    
2. Wprowadza swój unikalny adres e-mail i hasło (z spełnieniem wymagań bezpieczeństwa).
    
3. System sprawdza, czy adres e-mail jest już w bazie danych.
    
4. Jeśli e-mail jest unikalny, system zapisuje nowego użytkownika i pozwala mu na zalogowanie się.
    
5. Po udanej rejestracji użytkownik zostaje przekierowany do ekranu logowania.
    
6. Użytkownik może logować się, podając swój e-mail i hasło.
    
7. System autoryzuje użytkownika i umożliwia dostęp do funkcji paczkomatu po udanym logowaniu.
    