import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    en: {
        translation: {
            header: {
                searchPlaceholder: "Search books, authors…",
                home: "Home",
                books: "Books",
                about: "About",
                contact: "Contact",
                cart: "Cart",
                filters: "Open filters"
            },
            homeHeader: {
                recentBooks: "Recent Books"
            },
            cities: {
                "Toute la tunisie": "All Tunisia",
                "Tunis": "Tunis",
                "Ariana": "Ariana",
                "Manouba": "Manouba",
                "Ben Arous": "Ben Arous",
                "Nabeul": "Nabeul",
                "Bizerte": "Bizerte",
                "Zaghouan": "Zaghouan",
                "Sousse": "Sousse",
                "Monastir": "Monastir",
                "Mahdia": "Mahdia",
                "Sfax": "Sfax",
                "Béja": "Beja",
                "Jendouba": "Jendouba",
                "Le Kef": "Le Kef",
                "Siliana": "Siliana",
                "Kairouan": "Kairouan",
                "Sidi Bouzid": "Sidi Bouzid",
                "Kasserine": "Kasserine",
                "Gabès": "Gabes",
                "Médenine": "Medenine",
                "Gafsa": "Gafsa",
                "Tozeur": "Tozeur",
                "Tataouine": "Tataouine",
                "Kébili": "Kebili"
            },
            bookCard: {
                saved: "Saved",
                save: "Save",
                contact: "Contact",
                addToWishlist: "Add to wishlist"
            },
            filterPanel: {
                categories: "Categories",
                dealType: "Deal type",
                all: "All",
                exchange: "Exchange",
                sell: "Sell",
                donate: "Donate",
                tip: "Tip: combine search + filters to narrow down like a librarian 📚"
            },
            categories: {
                "All": "All",
                "Classics": "Classics",
                "Self-Help": "Self-Help",
                "Fantasy": "Fantasy",
                "Romance": "Romance",
                "Fiction": "Fiction",
                "Non‑Fiction": "Non-Fiction",
                "Children's Books": "Children's Books"
            },
            about: {
                title: "About",
                ktebna: "Ktebna",
                paragraph1: "is a community-driven platform built for book lovers. We believe that books should continue their journey, even after you've finished reading them. That's why we created a space where you can",
                sell: "sell",
                exchange: "exchange",
                or: "or",
                donate: "donate",
                yourBooks: "your books.",
                paragraph2: "Instead of leaving books to collect dust on shelves, give them a new life and let someone else enjoy the knowledge and stories inside. Whether you want to save money, discover new reads, or simply share knowledge with others —",
                makesItEasy: "makes it easy.",
                sellTitle: "Sell",
                sellDesc: "Turn your unused books into value by selling them to readers who need them.",
                exchangeTitle: "Exchange",
                exchangeDesc: "Swap your books with others and discover new reads without spending money.",
                donateTitle: "Donate",
                donateDesc: "Share knowledge and stories by donating books to those who need them most.",
                footer: "📚 Together, let's build a culture of sharing and make books more accessible."
            },
            contact: {
                title: "Contact",
                ktebna: "Ktebna",
                subtitle: "Have questions, feedback, or just want to reach out? Fill out the form below and we'll get back to you as soon as possible.",
                nameLabel: "Your Name",
                namePlaceholder: "Enter your name",
                emailLabel: "Your Email",
                emailPlaceholder: "Enter your email",
                messageLabel: "Message",
                messagePlaceholder: "Write your message...",
                sendButton: "Send Message",
                reachUs: "Or reach us at:"
            },
            sidebar: {
                posts: "Posts",
                savedPosts: "Saved Posts",
                conversations: "Conversations"
            },
            userPosts: {
                addPost: "Add Post",
                yourPosts: "Your Posts",
                loading: "Loading posts...",
                noPosts: "You don't have any posts yet.",
                edit: "Edit",
                delete: "Delete"
            }
        }
    },
    fr: {
        translation: {
            header: {
                searchPlaceholder: "Rechercher des livres, auteurs…",
                home: "Accueil",
                books: "Livres",
                about: "À propos",
                contact: "Contact",
                cart: "Panier",
                filters: "Ouvrir les filtres"
            },
            homeHeader: {
                recentBooks: "Livres récents"
            },
            cities: {
                "Toute la tunisie": "Toute la Tunisie",
                "Tunis": "Tunis",
                "Ariana": "Ariana",
                "Manouba": "Manouba",
                "Ben Arous": "Ben Arous",
                "Nabeul": "Nabeul",
                "Bizerte": "Bizerte",
                "Zaghouan": "Zaghouan",
                "Sousse": "Sousse",
                "Monastir": "Monastir",
                "Mahdia": "Mahdia",
                "Sfax": "Sfax",
                "Béja": "Béja",
                "Jendouba": "Jendouba",
                "Le Kef": "Le Kef",
                "Siliana": "Siliana",
                "Kairouan": "Kairouan",
                "Sidi Bouzid": "Sidi Bouzid",
                "Kasserine": "Kasserine",
                "Gabès": "Gabès",
                "Médenine": "Médenine",
                "Gafsa": "Gafsa",
                "Tozeur": "Tozeur",
                "Tataouine": "Tataouine",
                "Kébili": "Kébili"
            },
            bookCard: {
                saved: "Enregistré",
                save: "Enregistrer",
                contact: "Contacter",
                addToWishlist: "Ajouter à la liste de souhaits"
            },
            filterPanel: {
                categories: "Catégories",
                dealType: "Type de transaction",
                all: "Tous",
                exchange: "Échange",
                sell: "Vente",
                donate: "Don",
                tip: "Astuce: combinez recherche + filtres pour affiner comme un bibliothécaire 📚"
            },
            categories: {
                "All": "Tous",
                "Classics": "Classiques",
                "Self-Help": "Développement personnel",
                "Fantasy": "Fantaisie",
                "Romance": "Romance",
                "Fiction": "Fiction",
                "Non‑Fiction": "Non-Fiction",
                "Children's Books": "Livres pour enfants"
            },
            about: {
                title: "À propos de",
                ktebna: "Ktebna",
                paragraph1: "est une plateforme communautaire conçue pour les amateurs de livres. Nous croyons que les livres doivent continuer leur voyage, même après que vous les ayez terminés. C'est pourquoi nous avons créé un espace où vous pouvez",
                sell: "vendre",
                exchange: "échanger",
                or: "ou",
                donate: "donner",
                yourBooks: "vos livres.",
                paragraph2: "Au lieu de laisser les livres prendre la poussière sur les étagères, donnez-leur une nouvelle vie et laissez quelqu'un d'autre profiter des connaissances et des histoires qu'ils contiennent. Que vous souhaitiez économiser de l'argent, découvrir de nouvelles lectures ou simplement partager des connaissances avec d'autres —",
                makesItEasy: "le rend facile.",
                sellTitle: "Vendre",
                sellDesc: "Transformez vos livres inutilisés en valeur en les vendant à des lecteurs qui en ont besoin.",
                exchangeTitle: "Échanger",
                exchangeDesc: "Échangez vos livres avec d'autres et découvrez de nouvelles lectures sans dépenser d'argent.",
                donateTitle: "Donner",
                donateDesc: "Partagez des connaissances et des histoires en donnant des livres à ceux qui en ont le plus besoin.",
                footer: "📚 Ensemble, construisons une culture du partage et rendons les livres plus accessibles."
            },
            contact: {
                title: "Contacter",
                ktebna: "Ktebna",
                subtitle: "Vous avez des questions, des commentaires ou vous voulez simplement nous contacter ? Remplissez le formulaire ci-dessous et nous vous répondrons dès que possible.",
                nameLabel: "Votre nom",
                namePlaceholder: "Entrez votre nom",
                emailLabel: "Votre email",
                emailPlaceholder: "Entrez votre email",
                messageLabel: "Message",
                messagePlaceholder: "Écrivez votre message...",
                sendButton: "Envoyer le message",
                reachUs: "Ou contactez-nous à :"
            },
            sidebar: {
                posts: "Publications",
                savedPosts: "Publications enregistrées",
                conversations: "Conversations"
            },
            userPosts: {
                addPost: "Ajouter une publication",
                yourPosts: "Vos publications",
                loading: "Chargement des publications...",
                noPosts: "Vous n'avez pas encore de publications.",
                edit: "Modifier",
                delete: "Supprimer"
            }
        }
    },
    ar: {
        translation: {
            header: {
                searchPlaceholder: "البحث عن الكتب والمؤلفين…",
                home: "الرئيسية",
                books: "الكتب",
                about: "حول",
                contact: "اتصل بنا",
                cart: "السلة",
                filters: "فتح الفلاتر"
            },
            homeHeader: {
                recentBooks: "الكتب الحديثة"
            },
            cities: {
                "Toute la tunisie": "كل تونس",
                "Tunis": "تونس",
                "Ariana": "أريانة",
                "Manouba": "منوبة",
                "Ben Arous": "بن عروس",
                "Nabeul": "نابل",
                "Bizerte": "بنزرت",
                "Zaghouan": "زغوان",
                "Sousse": "سوسة",
                "Monastir": "المنستير",
                "Mahdia": "المهدية",
                "Sfax": "صفاقس",
                "Béja": "باجة",
                "Jendouba": "جندوبة",
                "Le Kef": "الكاف",
                "Siliana": "سليانة",
                "Kairouan": "القيروان",
                "Sidi Bouzid": "سيدي بوزيد",
                "Kasserine": "القصرين",
                "Gabès": "قابس",
                "Médenine": "مدنين",
                "Gafsa": "قفصة",
                "Tozeur": "توزر",
                "Tataouine": "تطاوين",
                "Kébili": "قبلي"
            },
            bookCard: {
                saved: "محفوظ",
                save: "حفظ",
                contact: "اتصل",
                addToWishlist: "أضف إلى قائمة الرغبات"
            },
            filterPanel: {
                categories: "الفئات",
                dealType: "نوع الصفقة",
                all: "الكل",
                exchange: "تبادل",
                sell: "بيع",
                donate: "تبرع",
                tip: "نصيحة: اجمع بين البحث والفلاتر للتضييق مثل أمين مكتبة 📚"
            },
            categories: {
                "All": "الكل",
                "Classics": "كلاسيكيات",
                "Self-Help": "تطوير ذاتي",
                "Fantasy": "خيال",
                "Romance": "رومانسية",
                "Fiction": "روايات",
                "Non‑Fiction": "واقعي",
                "Children's Books": "كتب الأطفال"
            },
            about: {
                title: "حول",
                ktebna: "كتبنا",
                paragraph1: "هي منصة مجتمعية مصممة لعشاق الكتب. نحن نؤمن بأن الكتب يجب أن تستمر في رحلتها، حتى بعد الانتهاء من قراءتها. لهذا السبب أنشأنا مساحة يمكنك فيها",
                sell: "بيع",
                exchange: "تبادل",
                or: "أو",
                donate: "التبرع",
                yourBooks: "بكتبك.",
                paragraph2: "بدلاً من ترك الكتب لتتراكم عليها الأتربة على الرفوف، امنحها حياة جديدة ودع شخصًا آخر يستمتع بالمعرفة والقصص بداخلها. سواء كنت ترغب في توفير المال أو اكتشاف قراءات جديدة أو ببساطة مشاركة المعرفة مع الآخرين —",
                makesItEasy: "يجعل الأمر سهلاً.",
                sellTitle: "بيع",
                sellDesc: "حوّل كتبك غير المستخدمة إلى قيمة من خلال بيعها للقراء الذين يحتاجونها.",
                exchangeTitle: "تبادل",
                exchangeDesc: "بادل كتبك مع الآخرين واكتشف قراءات جديدة دون إنفاق المال.",
                donateTitle: "تبرع",
                donateDesc: "شارك المعرفة والقصص من خلال التبرع بالكتب لمن يحتاجها أكثر.",
                footer: "📚 معًا، لنبني ثقافة المشاركة ونجعل الكتب أكثر سهولة في الوصول."
            },
            contact: {
                title: "اتصل بـ",
                ktebna: "كتبنا",
                subtitle: "هل لديك أسئلة أو ملاحظات أو تريد التواصل معنا؟ املأ النموذج أدناه وسنرد عليك في أقرب وقت ممكن.",
                nameLabel: "اسمك",
                namePlaceholder: "أدخل اسمك",
                emailLabel: "بريدك الإلكتروني",
                emailPlaceholder: "أدخل بريدك الإلكتروني",
                messageLabel: "الرسالة",
                messagePlaceholder: "اكتب رسالتك...",
                sendButton: "إرسال الرسالة",
                reachUs: "أو تواصل معنا على:"
            },
            sidebar: {
                posts: "المنشورات",
                savedPosts: "المنشورات المحفوظة",
                conversations: "المحادثات"
            },
            userPosts: {
                addPost: "إضافة منشور",
                yourPosts: "منشوراتك",
                loading: "جارٍ تحميل المنشورات...",
                noPosts: "ليس لديك أي منشورات بعد.",
                edit: "تعديل",
                delete: "حذف"
            }
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        debug: false,
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;