import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ReduxState } from "../interfaces"
import { Card, Container, Divider, Grid, Header, Segment } from "semantic-ui-react"
import { setDosages, setMedications, setProviders, setUserData } from "../reducers/app"
import { getDosages, getMedications, getProviders } from "../utils/api"
import { DateTime } from "luxon"
import { ToastContainer } from "react-toastify"
import axios from "axios"
import AuthenticationForm from "../components/Authentication"
import PageHeader from "../components/PageHeader"
import PrescriptionCard from "../components/PrescriptionCard"
import PrescriptionFilters from "../components/PrescriptionFilters"
import AppointmentCard from "../components/AppointmentCard"

function Home() {
    const dispatch = useDispatch()

    const isAuth = useSelector((state: ReduxState) => state.app.auth)
    const user = useSelector((state: ReduxState) => state.app.user)

    const prescriptions = user.prescriptions?.data
    const prescriptionsF = user.prescriptionsFiltered?.data

    const { appointments } = user

    const getUser = async (id: number) => {
        axios
            .get(`${import.meta.env.VITE_API_BASE_URL}user/${id}`)
            .then((response) => {
                dispatch(setUserData({ user: response.data.data }))
            })
            .catch(() => {})
    }

    useEffect(() => {
        if (!isAuth) {
            return
        }
        getDosages((dosages) => dispatch(setDosages({ dosages })), user.id)
        getMedications((medications) => dispatch(setMedications({ medications })), user.id)
        getProviders((providers) => dispatch(setProviders({ providers })), user.id)
        getUser(user.id)
    }, [isAuth])

    return (
        <div>
            <PageHeader />
            {isAuth ? (
                <Container style={{ marginTop: 50 }}>
                    <Header size="large">
                        {`Hi, ${user.name.first}`}
                        <Header.Subheader>
                            {DateTime.now().toLocaleString(DateTime.DATE_MED)}
                        </Header.Subheader>
                    </Header>
                    <Grid>
                        <Grid.Column>
                            <Header content="Prescriptions" size="large" />
                            <Segment>
                                <PrescriptionFilters
                                    src="app"
                                    prescriptions={[...prescriptions]}
                                    meds={Array.from(
                                        new Map(
                                            [...prescriptions].map((p) => [
                                                p.medication.id,
                                                p.medication
                                            ])
                                        ).values()
                                    )}
                                    dosages={Array.from(
                                        new Map(
                                            [...prescriptions]
                                                .sort((a, b) => a.dosage.amount - b.dosage.amount)
                                                .map((p) => [p.dosage.id, p.dosage])
                                        ).values()
                                    )}
                                />
                            </Segment>
                            {prescriptionsF.length > 0 ? (
                                <>
                                    <Card.Group itemsPerRow={3}>
                                        {prescriptionsF.map((p) => (
                                            <PrescriptionCard
                                                editable={false}
                                                userId={user.id}
                                                id={p.id}
                                                medication={p.medication}
                                                dosage={p.dosage}
                                                quantity={p.quantity}
                                                refillOn={p.refillOn}
                                                refillSchedule={p.refillSchedule}
                                            />
                                        ))}
                                    </Card.Group>
                                    <Divider section />
                                </>
                            ) : (
                                <Segment placeholder>
                                    <Header
                                        content={"No results..."}
                                        size="small"
                                        textAlign="center"
                                    />
                                </Segment>
                            )}

                            <Header content="Appointments" size="large" />
                            <Card.Group itemsPerRow={3}>
                                {appointments.data.map((a) => (
                                    <AppointmentCard
                                        editable={false}
                                        id={a.id}
                                        user={user}
                                        provider={a.provider}
                                        datetime={a.datetime}
                                        repeat={a.repeat}
                                    />
                                ))}
                            </Card.Group>
                        </Grid.Column>
                    </Grid>
                </Container>
            ) : (
                <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
                    <Grid.Column style={{ maxWidth: 450 }}>
                        <AuthenticationForm />
                    </Grid.Column>
                </Grid>
            )}
            <ToastContainer position="top-center" />
        </div>
    )
}

export default Home
