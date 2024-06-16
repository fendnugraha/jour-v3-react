<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Contact;
use App\Models\Payable;
use App\Models\Receivable;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render('Setting/Contact/ContactIndex', [
            'title' => 'Contact',
            'contacts' => \App\Models\Contact::orderBy('name')->paginate(10)->withQueryString(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'type' => 'required',
            'description' => 'required',
        ]);

        \App\Models\Contact::create($request->all());

        return redirect()->back()->with('message', 'Contact created successfully');
    }

    public function update(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'type' => 'required',
            'description' => 'required',
        ]);

        $contact = \App\Models\Contact::find($request->id);
        $contact->update($request->all());
        return redirect()->back()->with('message', 'Contact updated successfully');
    }

    public function destroy($id)
    {
        $contact = Contact::find($id);
        $receivableExists = Receivable::where('contact_id', $id)->exists();
        $payableExists = Payable::where('contact_id', $id)->exists();
        if ($receivableExists || $payableExists) {
            return redirect()->back()->with('error', 'Contact cannot be deleted because it has journal entries');
        } else {
            $contact->delete();
            return redirect()->back()->with('message', 'Contact deleted successfully');
        }
    }

    public function edit($id)
    {
        $contact = Contact::find($id);
        return Inertia::render('Setting/Contact/EditContact', [
            'title' => 'Edit Contact',
            'contact' => $contact
        ]);
    }
}
