import Navbar from "../components/navbar/Navbar.component";
import Footer from "../components/footer/Footer.component.jsx"
import Introduction from "./containers/introduction/introduction.search.jsx";

export default function SearchView() {
    return (
        <>
            <Navbar />
            <Introduction />
            <Footer />
        </>
    );
}