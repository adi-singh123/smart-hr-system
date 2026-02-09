import React, { useState } from "react";
import { Link } from "react-router-dom";
import Select from "react-select";

const ImageFilter = () => {

    const [itemFocus, setItemFocus] = useState(false);

    const inputFocus = () => {
        setItemFocus(true);
    };

    const inputBlur = () => {
        setItemFocus(false);
    };

    
    return (
        <div className="row filter-row space">
            <div className="col-sm-6 col-md-3">
                <div
                    className={`input-block mb-3 form-focus  ${itemFocus ? "focused" : ""
                        } `}
                >
                    <input
                        type="text"
                        className="form-control floating"
                        onFocus={inputFocus}
                        onBlur={inputBlur}
                    />
                    <label className="focus-label">Title</label>
                </div>
            </div>


            <div className="col-sm-6 col-md-3">
                <Link to="#" className="btn btn-success btn-block w-100">
                    {" "}
                    Search{" "}
                </Link>
            </div>
        </div>
    );
};

export default ImageFilter;
