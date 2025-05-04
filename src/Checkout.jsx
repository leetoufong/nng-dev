import { useEffect, useState } from "react";

const Checkout = (props) => {
    const {setCurrentPage, enrolled} = props;

    return (
        <>
            <h1 className="app-title">Checkout</h1>

            <button className="link" onClick={() => setCurrentPage('/')}>Go back</button>

            <div className="checkout">
                <ol className="checkout-list">
                    {enrolled?.map((course, index) => {
                        return (
                            <li className="checkout-item" key={index}>
                                <p><span>{index+1}. </span><strong className="checkout-label">Virtual Course:</strong> {course.instructors[0].first_name}</p>
                                <p>${course.pricing.amount}.00</p>
                            </li>
                        )
                    })}
                </ol>

                {/* Grab each pricing amount and sum it up with reducer method */}
                <p className="checkout-total"><strong>Total: ${enrolled.reduce((accumulator, item) => accumulator + item.pricing.amount, 0)}.00</strong> <small>({enrolled.length} courses)</small></p>
            </div>

            <button className="course-btn checkout-btn btn" onClick={(event) => {
                setCurrentPage('confirmation')
            }}>Checkout</button>
        </>
    )
}

export default Checkout
