import { Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Spinner from 'components/spinner/Spinner';
import { GiClick } from 'react-icons/gi';
import CommonCheckTable from 'components/reactTable/checktable';
import { fetchLeadCustomFiled } from '../../redux/slices/leadCustomFiledSlice';
import { useDispatch } from 'react-redux';
import { fetchLeadData } from '../../redux/slices/leadSlice';

const ContactModel = (props) => {
  const { onClose, isOpen, fieldName, setFieldValue, data } = props;
  const title = 'Leads';
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [leadData, setLeadData] = useState([]);
  const [selectedValues, setSelectedValues] = useState([]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      setFieldValue(fieldName, selectedValues);
      onClose();
    } catch (error) {
      console.error('Error during submission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomDataFields = async () => {
    setIsLoading(true);
    try {
      const result = await dispatch(fetchLeadCustomFiled());
      const customFields = result?.payload?.data || [];

      if (!customFields.length) {
        console.warn('No custom fields available.');
      }

      setLeadData(customFields);

      const tempTableColumns = [
        { Header: '#', accessor: '_id', isSortable: false, width: 10 },
        {
          Header: 'Status',
          accessor: 'leadStatus',
          isSortable: true,
          center: true,
          cell: ({ row }) => row.original.leadStatus || 'N/A', // Fallback in case leadStatus is undefined
        },
        ...(customFields?.[0]?.fields?.filter((field) => field?.isTableField)?.map((field) => (
          field?.name !== 'leadStatus' && { Header: field?.label, accessor: field?.name }
        )) || []),
      ];

      setColumns(tempTableColumns);
    } catch (error) {
      console.error('Error fetching custom data fields:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await dispatch(fetchLeadData());
        await fetchCustomDataFields();
      } catch (error) {
        console.error('Error during initial data fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  return (
    <Modal onClose={onClose} size="full" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select Lead</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {isLoading ? (
            <Flex justifyContent="center" alignItems="center" width="100%">
              <Spinner />
            </Flex>
          ) : (
            <CommonCheckTable
              title={title}
              isLoading={isLoading}
              columnData={columns ?? []}
              allData={data ?? []}
              tableData={data ?? []}
              tableCustomFields={leadData?.[0]?.fields?.filter((field) => field?.isTableField) || []}
              AdvanceSearch={() => ''}
              ManageGrid={false}
              deleteMany={false}
              selectedValues={selectedValues}
              setSelectedValues={setSelectedValues}
              selectType="single"
              customSearch={false}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            variant="brand"
            size="sm"
            me={2}
            disabled={isLoading}
            leftIcon={<GiClick />}
            onClick={handleSubmit}
          >
            {isLoading ? <Spinner /> : 'Select'}
          </Button>
          <Button variant="outline" size="sm" colorScheme="red" onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ContactModel;
