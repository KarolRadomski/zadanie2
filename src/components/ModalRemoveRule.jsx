import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
function ModalRemoveRule({ ruleToRemove, setRuleToRemove, removeRule }) {
  return (
    <Modal show={true} onHide={() => setRuleToRemove('')}>
      <Modal.Header closeButton>
        <Modal.Title>Removing rule</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>
          Are you sure you want to remove rule <strong>{ruleToRemove.name}</strong>?
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={() => setRuleToRemove('')}>
          Close
        </Button>
        <Button variant="primary" onClick={() => removeRule(ruleToRemove.index)}>
          Remove
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalRemoveRule;
