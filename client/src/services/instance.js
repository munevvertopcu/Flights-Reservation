import axios from 'axios';

export default axios.create({
    baseURL: `/api/public-flights`,
    headers: {
        'app_id': 'c1ac8def',
        'app_key': 'bdd4fde3528d88146542630a1a2a5d47',
        'ResourceVersion': 'v4',
        'Accept': 'application/json',
    }
}
)