import React, { useState } from 'react';
import { Button, Checkbox, Divider, Flex, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Switch } from '@chakra-ui/react';

interface SelectPersonModalProps {
  isOpen: boolean;
  onClose: (data: any) => void;
  people: Record<string, any>[];
}
 
const SelectPersonModal: React.FC<SelectPersonModalProps> = ({ isOpen, onClose, people }) => {
  const [create, setCreate] = useState(false);
  const [useDefaultAnswer, setUseDefaultAnswer] = useState(false);
  const [defaultAnswer, setDefaultAnswer] = useState("");
  const [name, setName] = useState("");
  const [personId, setPersonId] = useState("");

  const handleSave = () => {
    if (create) {
      onClose({ name, defaultAnswer: useDefaultAnswer ? defaultAnswer === "approve" : null });
    } else {
      onClose({ personId });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(null)} isCentered>
      <ModalOverlay />
      <ModalContent mx="4">
        <ModalHeader>
          Selecione uma pessoa
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex mb="4" align="center" justify="start">
            <Switch mr="2" checked={create} onChange={(e) => setCreate(e.target.checked)} />
            Criar nova pessoa
          </Flex>
          {create ? (
            <>
              <FormLabel>Nome</FormLabel>
              <Input placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
              <Flex align="center" justify="start" mb="2" mt="4">
                <FormLabel mb="0">Usar resposta padrão</FormLabel>
                <Switch defaultChecked={useDefaultAnswer} onChange={(e) => setUseDefaultAnswer(e.target.checked)} />
              </Flex>
              {useDefaultAnswer && (
                <Select placeholder="Selecione" value={defaultAnswer} onChange={(e) => setDefaultAnswer(e.target.value)}>
                  <option value="approve">Aprovar</option>
                  <option value="deny">Recusar</option>
                </Select>
              )}
            </>
          ) : (
            <>
              <FormLabel>Pessoa</FormLabel>
              <Select placeholder="Selecione" value={personId} onChange={(e) => setPersonId(e.target.value)}>
                {people.map((person) => (
                  <option key={person.id} value={person.id}>{person.name}</option>
                ))}
              </Select>
            </>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleSave}>Salvar</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
 
export default SelectPersonModal;
