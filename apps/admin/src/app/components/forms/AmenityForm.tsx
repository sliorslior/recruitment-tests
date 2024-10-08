import { useCallback, useContext, useEffect, useState } from 'react';
import { Grid, Modal } from '@mui/material';
import {
  axiosErrorToaster,
  renderDropdown,
  renderTextField,
  ServerContext,
} from '@base-frontend';
import { Btn, CloseButton, PrimaryText } from '@offisito-frontend';
import { Amenity, AmenityType, Company } from '@offisito-shared';
import { format, TODO } from '@base-shared';

interface AmenityFormProps {
  closeModal: () => void;
  editId?: string;
}

const AmenityForm = ({ closeModal, editId }: AmenityFormProps) => {
  const server = useContext(ServerContext);

  const [formState, setFormState] = useState<Amenity>({
    name: 'name',
    type: 'floor',
  } as unknown as Amenity);

  const fetchAmenity = useCallback(async () => {
    if (editId && server) {
      try {
        const { data } = await server.axiosInstance.get('api/amenities');
        setFormState(data.find(({ _id }: Amenity) => String(_id) === editId));
      } catch (e) {
        axiosErrorToaster(e);
      }
    }
  }, [editId, server]);

  useEffect(() => {
    fetchAmenity();
  }, [fetchAmenity]);

  const handleChange = (name: string, value: string | Date | boolean) => {
    formState &&
      setFormState(((prevState: Company) => ({
        ...prevState,
        [name]: value,
      })) as TODO);
  };

  return (
    <Modal open>
      <Grid
        item
        container
        direction="column"
        rowSpacing={4}
        sx={{ overflowX: 'scroll' }}
        wrap="nowrap"
        alignItems="center"
        padding="2%"
        width="80%"
        marginLeft="10%"
        bgcolor={(theme) => theme.palette.background.default}
        overflow="scroll"
      >
        <Grid item>
          <CloseButton onClick={closeModal} />
        </Grid>
        <Grid item>
          <PrimaryText variant="h4">Amenity</PrimaryText>
        </Grid>
        <Grid item>
          {renderTextField<Amenity>(formState, handleChange as TODO, 'name')}
        </Grid>
        <Grid item>
          {renderDropdown<Amenity>(
            formState,
            handleChange as TODO,
            'type',
            format('type'),
            Object.values(AmenityType).map((value) => ({
              value,
              label: format(value),
            })),
          )}
        </Grid>

        <Grid item>
          {server && (
            <Btn
              onClick={() =>
                (editId
                  ? server.axiosInstance.put(
                      'api/admin/amenities/' + editId,
                      formState,
                    )
                  : server.axiosInstance.post('api/admin/amenities', formState)
                )
                  .then(closeModal)
                  .catch((e) => axiosErrorToaster(e))
              }
            >
              Save
            </Btn>
          )}
        </Grid>
      </Grid>
    </Modal>
  );
};

export default AmenityForm;
