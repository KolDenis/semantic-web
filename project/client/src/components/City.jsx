import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCityDetails } from "../api";

const City = () => {
    const { id } = useParams();
    const [details, setDetails] = useState({});

    useEffect(() => {
        getCityDetails(id).then((res) => {
            setDetails(res.data);
            console.log(res.data)
        }).catch((err) => {
            console.error(err);
        })
    }, []);

    return (
        <div className="City">
            <h2>{details.name}</h2> <a href={details.uri}>dbpedia</a>
            {
                details.population &&
                <div>
                    <h3>Population</h3>
                    <p>{details.population}</p>
                </div>
            }
            {
                details.date_of_creation &&
                <div>
                    <h3>Date of creation</h3>
                    <p>{details.date_of_creation}</p>
                </div>
            }
            {
                details.description &&
                <div>
                    <h3>Description</h3>
                    <p>{details.description}</p>
                </div>
            }
            {
                details.history &&
                <div>
                    <h3>History</h3>
                    <p>{details.history}</p>
                </div>
            }
        </div>
    );
}

export default City;