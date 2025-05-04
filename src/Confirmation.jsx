const Confirmation = (props) => {
    const {setCurrentPage, setEnrolled, setChecked} = props;

    return (
        <>
            <h1 className="app-title">Thank you!</h1>
            <button className="link" onClick={() => {
                setCurrentPage('/');
                setChecked([]);
                setEnrolled([]);
            }}>Sign up for other courses</button>
        </>
    )
}

export default Confirmation