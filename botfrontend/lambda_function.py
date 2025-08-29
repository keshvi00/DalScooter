import json
import boto3
from datetime import datetime
from botocore.exceptions import ClientError

dynamodb = boto3.resource('dynamodb')
bookings_table = dynamodb.Table('BikeBookings')

def lambda_handler(event, context):
    """
    Handles Lex V2 requests with 3 key intents:
    - BikeAccessCode: Retrieve booking details
    - NavigationHelp: Provide guidance
    - SubmitConcern: Create support tickets
    """
    print("Received Lex event:", json.dumps(event, indent=2))
    
    # Add null checks for event structure
    if not event or 'sessionState' not in event:
        return error_response("Invalid event structure", None)
    
    session_state = event.get('sessionState')
    if not session_state or 'intent' not in session_state:
        return error_response("Missing intent in session state", None)
    
    intent = session_state.get('intent')
    if not intent or 'name' not in intent:
        return error_response("Missing intent name", None)
    
    intent_name = intent['name']
    slots = intent.get('slots', {})
    
    try:
        if intent_name == "BikeAccessCode":
            return handle_booking(slots, intent_name)
        elif intent_name == "NavigationHelp":
            return handle_navigation(intent_name)
        elif intent_name == "SubmitConcern":
            return handle_concern(slots, context, intent_name)
        else:
            return error_response("Intent not recognized", intent_name)
    except Exception as e:
        print(f"Error: {str(e)}")
        return error_response("Processing error", intent_name)

def handle_booking(slots, intent_name):
    """Retrieve bike access code from DynamoDB"""
    try:
        # Check if ReferenceNumber slot exists and has a value
        if ('ReferenceNumber' not in slots or 
            slots['ReferenceNumber'] is None or 
            'value' not in slots['ReferenceNumber'] or 
            slots['ReferenceNumber']['value'] is None):
            return error_response("Reference number is required", intent_name)
        
        ref_num = slots['ReferenceNumber']['value']['interpretedValue']
        
        response = bookings_table.get_item(
            Key={'BookingReference': ref_num}
        )
        
        if 'Item' not in response:
            return error_response("Booking not found", intent_name)
        
        item = response['Item']
        return success_response(
            f"Your access code: {item['AccessCode']}. Valid until {item['EndTime']}",
            intent_name
        )
    except KeyError as e:
        print(f"KeyError in handle_booking: {str(e)}")
        return error_response("Missing required booking information", intent_name)
    except ClientError as e:
        print(f"DynamoDB error: {str(e)}")
        return error_response("Database error occurred", intent_name)

def handle_navigation(intent_name):
    """Provide static help messages"""
    return success_response(
        "Register at: https://dalscooter.com/signup\n"
        "View bikes at: https://dalscooter.com/bikes",
        intent_name
    )

def handle_concern(slots, context, intent_name):
    """Create support ticket in DynamoDB"""
    try:
        ticket_id = f"TICKET-{context.aws_request_id}"
        
        # Check if ReferenceNumber slot exists and has a value
        if ('ReferenceNumber' not in slots or 
            slots['ReferenceNumber'] is None or 
            'value' not in slots['ReferenceNumber'] or 
            slots['ReferenceNumber']['value'] is None):
            return error_response("Reference number is required", intent_name)
        
        ref_num = slots['ReferenceNumber']['value']['interpretedValue']
        
  
        bookings_table.put_item(
            Item={
                'BookingReference': ticket_id,  
                'OriginalBookingRef': ref_num,
                'Status': 'OPEN',
                'CreatedAt': datetime.now().isoformat(),
                'Type': 'SUPPORT_TICKET'
            }
        )
        
        return success_response(
            f"Ticket #{ticket_id} created. A franchise operator will contact you.",
            intent_name
        )
    except KeyError as e:
        print(f"KeyError in handle_concern: {str(e)}")
        return error_response("Missing required information for ticket creation", intent_name)
    except ClientError as e:
        print(f"DynamoDB error: {str(e)}")
        return error_response("Error creating support ticket", intent_name)

def success_response(message, intent_name):
    """Standard Lex V2 success format"""
    return {
        "sessionState": {
            "dialogAction": {"type": "Close"},
            "intent": {
                "name": intent_name,
                "state": "Fulfilled"
            }
        },
        "messages": [
            {
                "contentType": "PlainText",
                "content": message
            }
        ]
    }

def error_response(message, intent_name):
    """Standard Lex V2 error format"""
    return {
        "sessionState": {
            "dialogAction": {"type": "Close"},
            "intent": {
                "name": intent_name,
                "state": "Failed"
            }
        },
        "messages": [
            {
                "contentType": "PlainText",
                "content": message
            }
        ]
    }