<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\MedicationCollection;
use App\Models\Medication;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class MedicationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return MedicationCollection
     */
    public function index(Request $request): MedicationCollection
    {
        $userId = $request->input('userId', null);

        if ($userId) {
            $meds = Medication::whereHas('prescriptions', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })->get();
        } else {
            $meds = Medication::all();
        }
        return new MedicationCollection($meds);
    }
}
