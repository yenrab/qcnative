//
//  AddUserBCO.m
//  QC Example
//
//  Created by Lee Barney on 3/15/11.
//  Copyright 2011 __MyCompanyName__. All rights reserved.
//

#import "AddUserBCO.h"
#import "QCRequestHandler.h"
#import "User.h"


@implementation AddUserBCO

+ (BOOL) handleIt:(NSMutableDictionary*) parameters{
    
	//get the managed object context for use in the core data request
    QCRequestHandler *theHandler = [parameters objectForKey:@"qcrequest handler"];
    NSString *contextKey = @"dataContext";
    NSManagedObjectContext *managedObjectContext = [parameters objectForKey:contextKey];
    NSLog(@"context: %@",managedObjectContext);
    if(!managedObjectContext){
        //build the managed object context in this thread if it doesn't already exist
        NSPersistentStoreCoordinator *theCoordinator = theHandler.coordinator;
        NSLog(@"coordinator: %@",theCoordinator);
        managedObjectContext = [[NSManagedObjectContext alloc] init];
        [managedObjectContext setPersistentStoreCoordinator: theCoordinator];
        [parameters setObject:managedObjectContext forKey:contextKey];
        NSLog(@"context: %@",managedObjectContext);
    }
    //create a managed user
	User *aUser = (User *)[NSEntityDescription insertNewObjectForEntityForName:@"User" 
                                                        inManagedObjectContext:managedObjectContext];
	//create a UUID for the user
    CFUUIDRef	userUUID = CFUUIDCreate(nil);//create a new UUID
    //get the string representation of the UUID
    NSString	*userUuidString = (NSString*)CFUUIDCreateString(nil, userUUID);
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
        [theHandler dispatchToECO:@"coreDataError" withParameters:errorDictionary];
	}
	return QC_STACK_CONTINUE;

}

@end
