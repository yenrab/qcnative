//
//  AddUserBCO.m
//  QC Example
//
//  Created by Lee Barney on 3/15/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "AddUserBCO.h"
#import "ControlObjectStack.h"
#import "User.h"


@implementation AddUserBCO

+ (QCReturnValue) handleIt:(NSMutableDictionary*) parameters{
    
	//get the managed object context for use in the core data request
    ControlObjectStack *theStack = [parameters objectForKey:@"co_stack"];
    NSString *contextKey = @"dataContext";
    NSManagedObjectContext *managedObjectContext = [parameters objectForKey:contextKey];
    //NSLog(@"context: %@",managedObjectContext);
    if(!managedObjectContext){
        //build the managed object context in this thread if it doesn't already exist
        NSPersistentStoreCoordinator *theCoordinator = theStack.coordinator;
        //NSLog(@"coordinator: %@",theCoordinator);
        managedObjectContext = [[NSManagedObjectContext alloc] init];
        [managedObjectContext setPersistentStoreCoordinator: theCoordinator];
        [parameters setObject:managedObjectContext forKey:contextKey];
        //NSLog(@"context: %@",managedObjectContext);
    }
    //create a managed user
	User *aUser = (User *)[NSEntityDescription insertNewObjectForEntityForName:@"User" 
                                                        inManagedObjectContext:managedObjectContext];
	//create a UUID for the user
    CFUUIDRef	userUUID = CFUUIDCreate(nil);//create a new UUID
    //get the string representation of the UUID
    NSString	*userUuidString = (NSString*)CFBridgingRelease(CFUUIDCreateString(nil, userUUID));
    CFRelease(userUUID);
    //get the name entered
    NSString *uname = [parameters objectForKey:@"name"];
    
    NSDate *timeStamp = [NSDate date];
    //update the user
    [aUser setName:uname];
    [aUser setId:userUuidString];
    [aUser setInsertTime:timeStamp];
	
    //save the user into the data store
	NSError *error;
	if (![managedObjectContext save:&error]) {
		// An example of how to handle errors
        NSMutableDictionary *errorDictionary = [NSMutableDictionary dictionaryWithObjectsAndKeys:error.localizedDescription, @"description", error.localizedFailureReason, @"reason", nil];
        [theStack dispatchToECO:@"coreDataError" withParameters:errorDictionary];
	}
	return QC_STACK_CONTINUE;

}

@end
