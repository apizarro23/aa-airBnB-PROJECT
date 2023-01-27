import React, { useState } from 'react'
import { Modal } from '../../context/Modal'
import DeleteBooking from './DeleteBooking'
import './DeleteBooking.css'

function DeleteBookingModal({ booking }) {
    const [showModal, setShowModal] = useState(false)

    return (
        <>
        <div className='cancel-btn' onClick={() => setShowModal(true)}>Cancel Reservation</div>
        {showModal && (
            <Modal onClose={() => setShowModal(false)}>
                <DeleteBooking booking={booking} onClick={() => setShowModal(false)} />
            </Modal>
        )}
        </>
    )
}

export default DeleteBookingModal