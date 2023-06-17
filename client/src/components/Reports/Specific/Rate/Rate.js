import React from 'react'
import { RateButton, RateIcon } from './Rate.styled'
import { useState } from 'react';
import RateModal from './RateModal/RateModal';

const Rate = (props) => {
    let [showRateModal, setShowRateModal] = useState(false);

    const handleOnClick = () => {
        setShowRateModal(true);
    }

    return (
        <>
            <RateButton onClick={handleOnClick}><RateIcon/>Wystaw ocenę</RateButton>
            {showRateModal && <RateModal modalShow={showRateModal} setModalShow={setShowRateModal} handleOnUpload={props.handleOnUpload}/>}
        </>
    )
}

export default Rate