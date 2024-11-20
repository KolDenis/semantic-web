import { useEffect, useState } from "react";
import { getCities, searchCityByName } from "../api";
import { Link } from "react-router-dom";

const Cities = () => {
    const [city, setCity] = useState("");
    const [cities, setCities] = useState([]);
    const [currecntPage, setCurrentPage] = useState(0);
    const [totalPages, settotalPages] = useState(1);
    const [pageElements, setPageElements] = useState([]);

    useEffect(()=>{
        getCitiesByPage();
    }, []);

    const getCitiesByPage = (page) =>{
        if(!page)
            page = currecntPage;

        getCities(city, page).then((res)=>{
            setCities(res.data.cities)
            if(res.data.cities != totalPages){
                settotalPages(res.data.totalPages);
                setPageElements(Array.from({ length: res.data.totalPages }, (_, index) => <button key={index} onClick={()=>getCitiesByPage(index+1)}>{index+1}</button>));
            }
        }).catch((err)=>{
            console.error(err);
        })
    }

    return (
        <div className="Cities">
            <h2>Cities</h2>
            <input type="text" value={city} onChange={e=>setCity(e.target.value)}/>
            <button onClick={getCitiesByPage}>search</button>
            <ul>
                {
                    cities.map(city => (
                        <li key={city.id}>
                            {city.name} <Link to={`/city/${city.id}`}>more</Link>
                        </li>
                    ))
                }
            </ul>

            <div className="paginator">
                Pages: {pageElements}
            </div>
        </div>
    );
}

export default Cities;